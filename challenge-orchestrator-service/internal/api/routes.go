package api

import (
	"challenge-orchestrator-service/internal/api/handlers"
	"net/http"

	"github.com/go-chi/chi/v5"
)

// RegisterRoutes registers all HTTP routes
func RegisterRoutes(r chi.Router, h *handlers.ChallengeHandler) {
	// Health endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"status":"ok"}`))
	})

	// Challenge endpoints
	r.Route("/challenges", func(r chi.Router) {
		r.Post("/deploy", h.DeployChallengeHandler)
		r.Get("/deployment/{id}/status", h.GetDeployedChallengeStatusHandler)
		r.Delete("/deployment/{id}", h.DestroyDeploymentHandler)
		r.Get("/deployment/{id}/results", h.GetChallengeResultsHandler)
	})
}
