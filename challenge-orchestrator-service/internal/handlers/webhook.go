package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"challenge-orchestrator-service/internal/domain"
)

type WebhookHandler struct{}

func NewWebhookHandler() *WebhookHandler {
	return &WebhookHandler{}
}

func (h *WebhookHandler) JenkinsCallback(w http.ResponseWriter, r *http.Request) {
	var payload domain.WebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received Jenkins callback: job=%s, build=%d, status=%s",
		payload.JobName, payload.BuildNumber, payload.Status)

	// TODO : supabase modif à faire (update deployment status based on callback)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "received"})
}
