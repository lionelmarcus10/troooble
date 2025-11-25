package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"challenge-orchestrator-service/internal/app"
	"challenge-orchestrator-service/internal/domain"
)

func generateID() string {
	return uuid.NewString()
}

// ChallengeHandler holds the service dependency
type ChallengeHandler struct {
	DeployService *app.DeployChallengeService
}

// DeployChallengeHandler triggers a challenge deployment
func (h *ChallengeHandler) DeployChallengeHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		Manifest string `json:"manifest"` // e.g., S3 URI or local path
		UserID   string `json:"user_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	challenge := domain.Challenge{
		ID:       generateID(), // you can use UUID
		Name:     req.Name,
		Manifest: req.Manifest,
		Status:   domain.ChallengeStatus(domain.StatusInitializing),
	}

	deployment, err := h.DeployService.DeployChallenge(r.Context(), challenge, req.UserID)
	if err != nil {
		http.Error(w, "deployment failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"challenge_id":  challenge.ID,
		"deployment_id": deployment.ID,
		"status":        deployment.Status,
	})
}

// GetDeployedChallengeStatusHandler returns the current status of a deployment
func (h *ChallengeHandler) GetDeployedChallengeStatusHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	// Here you would fetch from repository
	deployment, err := h.DeployService.Repo.GetDeployment(r.Context(), id)
	if err != nil {
		http.Error(w, "deployment not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"deployment_id": deployment.ID,
		"status":        deployment.Status,
	})
}

// DestroyDeploymentHandler handles the destruction of a deployment
func (h *ChallengeHandler) DestroyDeploymentHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Fetch deployment from repository
	deployment, err := h.DeployService.Repo.GetDeployment(r.Context(), id)
	if err != nil {
		http.Error(w, "deployment not found", http.StatusNotFound)
		return
	}

	// if deployment is already destroyed, return 204
	if deployment.Status == domain.DeploymentStatusDestroyed {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	// Destroy deployment using service
	err = h.DeployService.DestroyDeployment(r.Context(), deployment)
	if err != nil {
		http.Error(w, "failed to destroy deployment: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
