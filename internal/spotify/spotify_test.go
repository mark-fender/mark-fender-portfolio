package spotify

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
	"sync"
	"testing"
	"time"
)

type transportFunc func(*http.Request) (*http.Response, error)

func (f transportFunc) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }

type reply struct {
	status      int
	body, retry string
}

const tokenJSON = `{"access_token":"at","expires_in":3600}`
const currentJSON = `{"is_playing":true,"item":{"type":"track","name":"Says","artists":[{"name":"Nils Frahm"},{"name":"Ólafur Arnalds"}],"external_urls":{"spotify":"https://open.spotify.com/track/1"}}}`
const recentJSON = `{"items":[{"track":{"name":"Ambre","artists":[{"name":"Nils Frahm"}],"external_urls":{"spotify":"https://open.spotify.com/track/2"}}}]}`

func setup(t *testing.T, replies ...reply) (*Client, *time.Time, *[]string) {
	t.Helper()
	t.Setenv("SPOTIFY_CLIENT_ID", "id")
	t.Setenv("SPOTIFY_CLIENT_SECRET", "secret")
	t.Setenv("SPOTIFY_REFRESH_TOKEN", "rt")
	now := time.Date(2026, 11, 24, 12, 0, 0, 0, time.UTC)
	paths := []string{}
	c := New()
	c.now = func() time.Time { return now }
	c.httpClient.Transport = transportFunc(func(r *http.Request) (*http.Response, error) {
		paths = append(paths, r.URL.RequestURI())
		if r.URL.Host == "accounts.spotify.com" {
			id, secret, ok := r.BasicAuth()
			if !ok || id != "id" || secret != "secret" {
				t.Error("incorrect token credentials")
			}
			if r.Method != "POST" || r.Header.Get("Content-Type") != "application/x-www-form-urlencoded" {
				t.Error("incorrect token request")
			}
			if err := r.ParseForm(); err != nil || r.Form.Get("grant_type") != "refresh_token" || r.Form.Get("refresh_token") != "rt" {
				t.Error("incorrect refresh form")
			}
		} else if r.URL.Host != "api.spotify.com" || r.Header.Get("Authorization") != "Bearer at" {
			t.Error("incorrect Spotify API request")
		}
		if len(replies) == 0 {
			t.Error("unexpected Spotify request")
			return nil, errors.New("unexpected request")
		}
		next := replies[0]
		replies = replies[1:]
		if next.status == 0 {
			return nil, errors.New("offline")
		}
		return &http.Response{StatusCode: next.status, Header: http.Header{"Retry-After": []string{next.retry}}, Body: io.NopCloser(strings.NewReader(next.body))}, nil
	})
	return c, &now, &paths
}

func TestMissingCredentials(t *testing.T) {
	for _, name := range []string{"SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN"} {
		t.Run(name, func(t *testing.T) {
			c, _, paths := setup(t)
			t.Setenv(name, "")
			if got := c.Get(context.Background()); got != nil || len(*paths) != 0 {
				t.Fatalf("got %v, requests %v", got, *paths)
			}
		})
	}
}

func TestCurrentTrackAndConcurrentCache(t *testing.T) {
	c, now, paths := setup(t, reply{200, tokenJSON, ""}, reply{200, currentJSON, ""}, reply{200, currentJSON, ""})
	var wg sync.WaitGroup
	for range 20 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			got := c.Get(context.Background())
			if got == nil || *got != (Listening{"Says", "Nils Frahm, Ólafur Arnalds", "https://open.spotify.com/track/1", true}) {
				t.Errorf("got %+v", got)
			}
		}()
	}
	wg.Wait()
	encoded, err := json.Marshal(c.Get(context.Background()))
	if err != nil || string(encoded) != `{"title":"Says","artist":"Nils Frahm, Ólafur Arnalds","url":"https://open.spotify.com/track/1","playing":true}` {
		t.Fatalf("listening JSON contract: %s, %v", encoded, err)
	}
	*now = now.Add(30*time.Second - time.Nanosecond)
	c.Get(context.Background())
	if len(*paths) != 2 {
		t.Fatalf("cache missed: %v", *paths)
	}
	*now = now.Add(time.Nanosecond)
	c.Get(context.Background())
	if len(*paths) != 3 || (*paths)[2] != "/v1/me/player/currently-playing" {
		t.Fatalf("result expired without reusing token: %v", *paths)
	}
}

func TestRecentFallback(t *testing.T) {
	for _, body := range []string{"", `{"is_playing":false}`, `{"is_playing":true,"item":null}`, `{"is_playing":true,"item":{"type":"episode"}}`, `{"is_playing":true,"item":{}}`} {
		t.Run(body, func(t *testing.T) {
			status := 200
			if body == "" {
				status = 204
			}
			c, _, paths := setup(t, reply{200, tokenJSON, ""}, reply{status, body, ""}, reply{200, recentJSON, ""})
			got := c.Get(context.Background())
			if got == nil || *got != (Listening{"Ambre", "Nils Frahm", "https://open.spotify.com/track/2", false}) {
				t.Fatalf("got %+v", got)
			}
			if (*paths)[2] != "/v1/me/player/recently-played?limit=1" {
				t.Fatal(*paths)
			}
		})
	}
}

func TestFailuresReturnNull(t *testing.T) {
	cases := map[string][]reply{
		"token denied":         {{400, `{}`, ""}},
		"offline":              {{0, "", ""}},
		"invalid token JSON":   {{200, `{`, ""}},
		"empty token":          {{200, `{}`, ""}},
		"invalid current JSON": {{200, tokenJSON, ""}, {200, `{`, ""}},
		"current unavailable":  {{200, tokenJSON, ""}, {503, "", ""}},
		"recent unavailable":   {{200, tokenJSON, ""}, {204, "", ""}, {503, "", ""}},
		"invalid recent JSON":  {{200, tokenJSON, ""}, {204, "", ""}, {200, `{`, ""}},
		"no history":           {{200, tokenJSON, ""}, {204, "", ""}, {200, `{"items":[]}`, ""}},
	}
	for name, replies := range cases {
		t.Run(name, func(t *testing.T) {
			c, _, paths := setup(t, replies...)
			if c.Get(context.Background()) != nil {
				t.Fatal("expected null")
			}
			if len(*paths) != len(replies) {
				t.Fatalf("failed result was not cached: %v", *paths)
			}
		})
	}
}

func TestTokenRefresh(t *testing.T) {
	for _, revoked := range []bool{false, true} {
		t.Run(map[bool]string{false: "expiry", true: "revoked"}[revoked], func(t *testing.T) {
			status, body, elapsed := 200, currentJSON, 3540*time.Second
			if revoked {
				status, body, elapsed = 401, "", 30*time.Second
			}
			c, now, paths := setup(t, reply{200, tokenJSON, ""}, reply{status, body, ""}, reply{200, tokenJSON, ""}, reply{200, currentJSON, ""})
			c.Get(context.Background())
			*now = now.Add(elapsed)
			if c.Get(context.Background()) == nil || len(*paths) != 4 || (*paths)[2] != "/api/token" {
				t.Fatalf("token was not refreshed: %v", *paths)
			}
		})
	}
}

func TestRateLimitCooldown(t *testing.T) {
	for _, retry := range []string{"120", "", "invalid", "0", "-1"} {
		t.Run(retry, func(t *testing.T) {
			c, now, paths := setup(t, reply{429, "", retry}, reply{200, tokenJSON, ""}, reply{200, currentJSON, ""})
			if c.Get(context.Background()) != nil {
				t.Fatal("expected null on 429")
			}
			delay := 60 * time.Second
			if retry == "120" {
				delay = 120 * time.Second
			}
			*now = now.Add(delay - time.Nanosecond)
			if c.Get(context.Background()) != nil || len(*paths) != 1 {
				t.Fatal("retried before cooldown ended")
			}
			*now = now.Add(time.Nanosecond)
			if c.Get(context.Background()) == nil {
				t.Fatal("did not recover after cooldown")
			}
		})
	}
}

func TestNetworkFailureRecovers(t *testing.T) {
	c, now, _ := setup(t, reply{0, "", ""}, reply{200, tokenJSON, ""}, reply{200, currentJSON, ""})
	if c.Get(context.Background()) != nil {
		t.Fatal("expected null offline")
	}
	*now = now.Add(30 * time.Second)
	if c.Get(context.Background()) == nil {
		t.Fatal("did not recover")
	}
}

func TestCancelledFetchDoesNotCacheNull(t *testing.T) {
	for _, path := range []string{"/api/token", "/v1/me/player/currently-playing", "/v1/me/player/recently-played"} {
		t.Run(path, func(t *testing.T) {
			replies := []reply{{200, tokenJSON, ""}}
			if path == "/v1/me/player/recently-played" {
				replies = append(replies, reply{204, "", ""})
			}
			replies = append(replies, reply{200, currentJSON, ""})
			c, _, _ := setup(t, replies...)
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			transport := c.httpClient.Transport
			cancelled := false
			c.httpClient.Transport = transportFunc(func(r *http.Request) (*http.Response, error) {
				if r.URL.Path == path && !cancelled {
					cancelled = true
					cancel()
					return nil, r.Context().Err()
				}
				return transport.RoundTrip(r)
			})
			if c.Get(ctx) != nil {
				t.Fatal("expected null for cancelled fetch")
			}
			got := c.Get(context.Background())
			if got == nil || *got != (Listening{"Says", "Nils Frahm, Ólafur Arnalds", "https://open.spotify.com/track/1", true}) {
				t.Fatalf("healthy caller did not recover immediately: %+v", got)
			}
		})
	}
}

func TestPlaybackRateLimitCooldown(t *testing.T) {
	for _, recent := range []bool{false, true} {
		t.Run(map[bool]string{false: "current", true: "recent"}[recent], func(t *testing.T) {
			replies := []reply{{200, tokenJSON, ""}}
			if recent {
				replies = append(replies, reply{204, "", ""})
			}
			replies = append(replies, reply{429, "", "120"}, reply{200, currentJSON, ""})
			c, now, paths := setup(t, replies...)
			if c.Get(context.Background()) != nil {
				t.Fatal("expected null on 429")
			}
			calls := len(*paths)
			*now = now.Add(60 * time.Second)
			if c.Get(context.Background()) != nil || len(*paths) != calls {
				t.Fatal("ignored playback cooldown")
			}
			*now = now.Add(60 * time.Second)
			if c.Get(context.Background()) == nil || len(*paths) != calls+1 {
				t.Fatal("did not recover with cached token")
			}
		})
	}
}
