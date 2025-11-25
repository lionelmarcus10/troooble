package handlers

import (
	"challenge-orchestrator-service/internal/domain"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

// GetChallengeResultsHandler returns validation results for a deployment
func (h *ChallengeHandler) GetChallengeResultsHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Get the deployment
	deployment, err := h.DeployService.Repo.GetDeployment(r.Context(), id)
	if err != nil {
		http.Error(w, "deployment not found", http.StatusNotFound)
		return
	}

	// Fetch results (already run by the worker)
	result, err := h.DeployService.Repo.GetValidationResult(r.Context(), deployment.ID)
	if err != nil {
		// No results yet (worker hasn't processed it)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"deployment_id": deployment.ID,
			"results":       nil,
			"status":        domain.DeploymentStatusPending,
		})
		return
	}

	// Return results
	json.NewEncoder(w).Encode(map[string]interface{}{
		"deployment_id": deployment.ID,
		"results":       result,
		"status":        domain.DeploymentStatusFinished,
	})
}
