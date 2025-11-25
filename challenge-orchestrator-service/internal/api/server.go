package api

import (
    "net/http"
    "github.com/go-chi/chi/v5"
    "challenge-orchestrator-service/internal/app"
    "challenge-orchestrator-service/internal/api/handlers"
)

// NewServer creates and returns a chi router with all routes registered
func NewServer(deployService *app.DeployChallengeService) *chi.Mux {
    r := chi.NewRouter()
    h := &handlers.ChallengeHandler{DeployService: deployService}

    // Register all routes from routes.go
    RegisterRoutes(r, h)

    return r
}

// StartServer starts the HTTP server on the given address
func StartServer(addr string, deployService *app.DeployChallengeService) error {
    router := NewServer(deployService)
    return http.ListenAndServe(addr, router)
}
