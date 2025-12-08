package middleware

import (
	"context"
	"net/http"
	"strings"

	"challenge-orchestrator-service/internal/domain"

	"github.com/supabase-community/supabase-go"
)

type AuthMiddleware struct {
	client *supabase.Client
}

func NewAuthMiddleware(supabaseURL, supabaseKey string) *AuthMiddleware {
	client, _ := supabase.NewClient(supabaseURL, supabaseKey, nil)
	return &AuthMiddleware{client: client}
}

func (a *AuthMiddleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing authorization header", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "invalid authorization header format", http.StatusUnauthorized)
			return
		}

		token := parts[1]

		// Use the token to get user info from Supabase Auth
		user, err := a.client.Auth.WithToken(token).GetUser()
		if err != nil || user == nil {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), domain.UserIDKey, user.ID.String())
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
