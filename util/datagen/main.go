package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/brianvoe/gofakeit/v7"
	jwt "github.com/golang-jwt/jwt/v5"
)


type Artist struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	CountryOfOrigin string `json:"countryOfOrigin"`
	PrimaryGenre    string `json:"primaryGenre"`
	Description     string `json:"description"`
}


type Track struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	ArtistID    string `json:"artistId"`
	PublishedAt string `json:"publishedAt"` 
	Category    string `json:"category"`
	Album       string `json:"album"`
	MediaType   string `json:"mediaType"`
	FileName    string `json:"fileName"`
	Length      string `json:"length"` 
}

type oauthTokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int64  `json:"expires_in"`
	Scope       string `json:"scope"`
}


type OAuthConfig struct {
	TokenURL     string
	ClientID     string
	ClientSecret string
	Username     string
	Password     string
}

func main() {
	var (
		numArtists int
		minTracks  int
		maxTracks  int
		baseURL    string
		seed       int64
		startYear  int

		tokenURL     string
		clientID     string
		clientSecret string
		username     string
		password     string
	)

	flag.IntVar(&numArtists, "artists", 50, "number of artists to generate")
	flag.IntVar(&minTracks, "min-tracks", 1, "minimum tracks per artist")
	flag.IntVar(&maxTracks, "max-tracks", 5, "maximum tracks per artist")
	flag.StringVar(&baseURL, "base-url", "http://localhost:8080", "base URL of the music API")
	flag.Int64Var(&seed, "seed", time.Now().UnixNano(), "random seed (default: current time)")
	flag.IntVar(&startYear, "start-year", 1950, "earliest release year for tracks")

	flag.StringVar(&tokenURL, "token-url", "http://localhost:8081/realms/music/protocol/openid-connect/token", "Keycloak token URL")
	flag.StringVar(&clientID, "client-id", "music-service", "OAuth2 client ID")
	flag.StringVar(&clientSecret, "client-secret", "XbHlTBe2uE5p4kZxvWHv5tgtz3OWGzGa", "OAuth2 client secret")
	flag.StringVar(&username, "username", "admin@admin.com", "username for password grant")
	flag.StringVar(&password, "password", "admin", "password for password grant")

	flag.Parse()

	if numArtists <= 0 {
		log.Fatalf("artists must be > 0, got %d", numArtists)
	}
	if minTracks <= 0 {
		log.Fatalf("min-tracks must be > 0, got %d", minTracks)
	}
	if maxTracks < minTracks {
		log.Fatalf("max-tracks (%d) must be >= min-tracks (%d)", maxTracks, minTracks)
	}

	gofakeit.Seed(seed)

	oauthCfg := OAuthConfig{
		TokenURL:     tokenURL,
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Username:     username,
		Password:     password,
	}

	accessToken, err := getAccessToken(oauthCfg)
	if err != nil {
		log.Fatalf("failed to get access token: %v", err)
	}
	logTokenInfo(accessToken)

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	genres := []string{
		"Rock", "Pop", "Jazz", "Electronic", "Hip-Hop",
		"Classical", "Metal", "Alternative", "Funk", "Soul",
	}
	mediaTypes := []string{"CD", "Vinyl", "MP3", "Digital"}

	now := time.Now()

	log.Printf("Generating %d artists (min-tracks=%d, max-tracks=%d) to %s as %s",
		numArtists, minTracks, maxTracks, baseURL, username)

	for i := 0; i < numArtists; i++ {
		artistID := gofakeit.UUID()
		artistName := gofakeit.SongArtist()
		genre := gofakeit.RandomString(genres)

		artist := Artist{
			ID:              artistID,
			Name:            artistName,
			CountryOfOrigin: gofakeit.Country(),
			PrimaryGenre:    genre,
			Description:     gofakeit.Bio(),
		}

		if err := postJSON(client, baseURL+"/api/v1/artists", artist, accessToken, nil); err != nil {
			log.Fatalf("failed to POST artist %q: %v", artist.Name, err)
		}

		numTracksForArtist := gofakeit.Number(minTracks, maxTracks)

		for j := 0; j < numTracksForArtist; j++ {
			trackID := gofakeit.UUID()
			song := gofakeit.Song()
			title := song.Name
			album := gofakeit.BookTitle()
			category := genre
			mediaType := gofakeit.RandomString(mediaTypes)

			year := gofakeit.Number(startYear, now.Year())
			publishedAt := randomDateInYear(year).Format(time.RFC3339)

			lengthSeconds := gofakeit.Number(120, 720) 
			lengthISO := isoDurationFromSeconds(lengthSeconds)

			fileName := fmt.Sprintf(
				"%s_%s.%s",
				slugify(artistName),
				slugify(album),
				strings.ToLower(mediaType),
			)

			track := Track{
				ID:          trackID,
				Title:       title,
				ArtistID:    artistID,
				PublishedAt: publishedAt,
				Category:    category,
				Album:       album,
				MediaType:   mediaType,
				FileName:    fileName,
				Length:      lengthISO,
			}

			if err := postJSON(client, baseURL+"/api/v1/tracks", track, accessToken, nil); err != nil {
				log.Fatalf("failed to POST track %q for artist %q: %v", title, artistName, err)
			}
		}
	}

	log.Printf("Done.")
}


func getAccessToken(cfg OAuthConfig) (string, error) {
	data := url.Values{}
	data.Set("grant_type", "password")
	data.Set("client_id", cfg.ClientID)
	if cfg.ClientSecret != "" {
		data.Set("client_secret", cfg.ClientSecret)
	}
	data.Set("username", cfg.Username)
	data.Set("password", cfg.Password)

	req, err := http.NewRequest(http.MethodPost, cfg.TokenURL, strings.NewReader(data.Encode()))
	if err != nil {
		return "", fmt.Errorf("create token request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("token request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		var body bytes.Buffer
		_, _ = body.ReadFrom(resp.Body)
		return "", fmt.Errorf("token endpoint returned %s: %s", resp.Status, body.String())
	}

	var tok oauthTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tok); err != nil {
		return "", fmt.Errorf("decode token response: %w", err)
	}

	if tok.AccessToken == "" {
		return "", fmt.Errorf("no access_token in token response")
	}

	return tok.AccessToken, nil
}


func logTokenInfo(tokenStr string) {
	parser := jwt.NewParser(jwt.WithoutClaimsValidation())
	claims := jwt.MapClaims{}
	_, _, err := parser.ParseUnverified(tokenStr, claims)
	if err != nil {
		log.Printf("warning: unable to decode JWT for logging: %v", err)
		return
	}

	sub, _ := claims["sub"].(string)
	preferred, _ := claims["preferred_username"].(string)
	expUnix, _ := claims["exp"].(float64)

	var exp time.Time
	if expUnix != 0 {
		exp = time.Unix(int64(expUnix), 0)
	}

	log.Printf("Obtained access token for sub=%q preferred_username=%q exp=%s",
		sub, preferred, exp.Format(time.RFC3339))
}



func postJSON(client *http.Client, url string, body any, accessToken string, respDest any) error {
	data, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("json marshal: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("new request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	if accessToken != "" {
		req.Header.Set("Authorization", "Bearer "+accessToken)
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("http post: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		var bodyBuf bytes.Buffer
		_, _ = bodyBuf.ReadFrom(resp.Body)
		return fmt.Errorf("unexpected status %s from %s: %s", resp.Status, url, bodyBuf.String())
	}

	if respDest != nil {
		if err := json.NewDecoder(resp.Body).Decode(respDest); err != nil {
			return fmt.Errorf("decode response: %w", err)
		}
	}

	return nil
}


func randomDateInYear(year int) time.Time {
	start := time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(year, 12, 31, 23, 59, 59, 0, time.UTC)
	return gofakeit.DateRange(start, end)
}


func isoDurationFromSeconds(seconds int) string {
	return fmt.Sprintf("PT%dS", seconds)
}


func slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = strings.ReplaceAll(s, " ", "_")

	var b strings.Builder
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '_' {
			b.WriteRune(r)
		}
	}
	res := b.String()
	if res == "" {
		return "unknown"
	}
	return res
}
