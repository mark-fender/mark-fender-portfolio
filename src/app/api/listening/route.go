package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/mark-fender/mark-fender-portfolio/internal/spotify"
)

var listening = spotify.New()

func GET(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=30")
	if err := json.NewEncoder(w).Encode(listening.Get(r.Context())); err != nil {
		log.Printf("listening response: %v", err)
	}
}
