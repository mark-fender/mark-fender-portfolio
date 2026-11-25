// Package spotify supplies the current track, or the last played track, to the listening route.
package spotify

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Listening struct {
	Title   string `json:"title"`
	Artist  string `json:"artist"`
	URL     string `json:"url"`
	Playing bool   `json:"playing"`
}

type track struct {
	Type    string `json:"type"`
	Name    string `json:"name"`
	Artists []struct {
		Name string `json:"name"`
	} `json:"artists"`
	ExternalURLs struct {
		Spotify string `json:"spotify"`
	} `json:"external_urls"`
}

func (t track) listening(playing bool) *Listening {
	artists := make([]string, len(t.Artists))
	for i, artist := range t.Artists {
		artists[i] = artist.Name
	}
	return &Listening{t.Name, strings.Join(artists, ", "), t.ExternalURLs.Spotify, playing}
}

// Client owns the per-process token, result cache and Spotify rate-limit cooldown.
// The mutex also makes concurrent requests share a single Spotify fetch.
type Client struct {
	mu           sync.Mutex
	httpClient   *http.Client
	now          func() time.Time
	token        string
	tokenUntil   time.Time
	result       *Listening
	resultUntil  time.Time
	blockedUntil time.Time
}

func New() *Client {
	return &Client{httpClient: &http.Client{Timeout: 10 * time.Second}, now: time.Now}
}

// Get returns nil when Spotify isn't configured, has no history, or fails.
func (c *Client) Get(ctx context.Context) *Listening {
	c.mu.Lock()
	defer c.mu.Unlock()
	now := c.now()
	if now.Before(c.resultUntil) || now.Before(c.blockedUntil) {
		return c.result
	}
	value, err := c.fetch(ctx)
	// A disconnected caller must not cache a failure for other visitors.
	if ctx.Err() != nil {
		return nil
	}
	c.result = value
	c.resultUntil = now.Add(30 * time.Second)
	if err != nil {
		log.Printf("spotify: %v", err)
	}
	return c.result
}

func (c *Client) request(req *http.Request, dest any) (int, error) {
	res, err := c.httpClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()
	if res.StatusCode == http.StatusUnauthorized {
		c.token = ""
	}
	if res.StatusCode == http.StatusTooManyRequests {
		seconds, err := strconv.Atoi(res.Header.Get("Retry-After"))
		if err != nil || seconds <= 0 {
			seconds = 60
		}
		c.blockedUntil = c.now().Add(time.Duration(seconds) * time.Second)
	}
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return res.StatusCode, fmt.Errorf("%s: %d", req.URL.Path, res.StatusCode)
	}
	if res.StatusCode == http.StatusNoContent {
		return res.StatusCode, nil
	}
	return res.StatusCode, json.NewDecoder(res.Body).Decode(dest)
}

func (c *Client) accessToken(ctx context.Context) (string, error) {
	id, secret, refresh := os.Getenv("SPOTIFY_CLIENT_ID"), os.Getenv("SPOTIFY_CLIENT_SECRET"), os.Getenv("SPOTIFY_REFRESH_TOKEN")
	if id == "" || secret == "" || refresh == "" {
		return "", nil
	}
	if c.token != "" && c.now().Before(c.tokenUntil) {
		return c.token, nil
	}
	form := url.Values{"grant_type": {"refresh_token"}, "refresh_token": {refresh}}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://accounts.spotify.com/api/token", strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}
	req.SetBasicAuth(id, secret)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	var body struct {
		Token     string `json:"access_token"`
		ExpiresIn int    `json:"expires_in"`
	}
	if _, err := c.request(req, &body); err != nil {
		return "", err
	}
	if body.Token == "" || body.ExpiresIn <= 0 {
		return "", fmt.Errorf("invalid token response")
	}
	c.token = body.Token
	c.tokenUntil = c.now().Add(time.Duration(body.ExpiresIn-60) * time.Second)
	return c.token, nil
}

func (c *Client) fetch(ctx context.Context) (*Listening, error) {
	token, err := c.accessToken(ctx)
	if err != nil || token == "" {
		return nil, err
	}
	get := func(path string, dest any) (int, error) {
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.spotify.com/v1/me/player"+path, nil)
		if err != nil {
			return 0, err
		}
		req.Header.Set("Authorization", "Bearer "+token)
		return c.request(req, dest)
	}
	var now struct {
		Playing bool   `json:"is_playing"`
		Item    *track `json:"item"`
	}
	status, err := get("/currently-playing", &now)
	if err != nil {
		return nil, err
	}
	if status == http.StatusOK && now.Playing && now.Item != nil && now.Item.Type == "track" {
		return now.Item.listening(true), nil
	}
	var recent struct {
		Items []struct {
			Track track `json:"track"`
		} `json:"items"`
	}
	if _, err := get("/recently-played?limit=1", &recent); err != nil {
		return nil, err
	}
	if len(recent.Items) == 0 {
		return nil, nil
	}
	return recent.Items[0].Track.listening(false), nil
}
