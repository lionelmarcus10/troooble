package handlers

import (
	"encoding/json"
	"net/http"

	"challenge-orchestrator-service/internal/domain"
	"challenge-orchestrator-service/internal/services"

	"github.com/go-chi/chi/v5"
)

type ChallengeHandler struct {
	service *services.ChallengeService
}

func NewChallengeHandler(service *services.ChallengeService) *ChallengeHandler {
	return &ChallengeHandler{service: service}
}

func (h *ChallengeHandler) Deploy(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(domain.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "user not authenticated", http.StatusUnauthorized)
		return
	}

	var req domain.DeployRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if req.ChallengeID == "" {
		http.Error(w, "challengeId is required", http.StatusBadRequest)
		return
	}

	jobID := h.service.Deploy(userID, req.ChallengeID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(domain.ChallengeResponse{
		JobID:  jobID,
		Status: "pending",
	})
}

func (h *ChallengeHandler) Destroy(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(domain.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "user not authenticated", http.StatusUnauthorized)
		return
	}

	deploymentID := chi.URLParam(r, "id")
	if deploymentID == "" {
		http.Error(w, "deployment id is required", http.StatusBadRequest)
		return
	}

	jobID := h.service.Destroy(userID, deploymentID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(domain.ChallengeResponse{
		JobID:  jobID,
		Status: "pending",
	})
}

func (h *ChallengeHandler) Validate(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(domain.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "user not authenticated", http.StatusUnauthorized)
		return
	}

	deploymentID := chi.URLParam(r, "id")
	if deploymentID == "" {
		http.Error(w, "deployment id is required", http.StatusBadRequest)
		return
	}

	var req domain.ValidateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if req.Flag == "" {
		http.Error(w, "flag is required", http.StatusBadRequest)
		return
	}

	jobID := h.service.Validate(userID, deploymentID, req.Flag)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(domain.ChallengeResponse{
		JobID:  jobID,
		Status: "pending",
	})
}
