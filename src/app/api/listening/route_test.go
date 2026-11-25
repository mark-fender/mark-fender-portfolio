package main

import (
	"net/http/httptest"
	"testing"
)

func TestUnavailableListening(t *testing.T) {
	t.Setenv("SPOTIFY_REFRESH_TOKEN", "")
	response := httptest.NewRecorder()
	GET(response, httptest.NewRequest("GET", "/api/listening", nil))
	if response.Code != 200 || response.Body.String() != "null\n" {
		t.Fatalf("got %d %s", response.Code, response.Body)
	}
	if response.Header().Get("Content-Type") != "application/json" {
		t.Fatal("missing JSON content type")
	}
	if response.Header().Get("Cache-Control") != "public, s-maxage=30, stale-while-revalidate=30" {
		t.Fatal("missing bounded CDN cache")
	}
}
