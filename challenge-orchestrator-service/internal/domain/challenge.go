package domain

type DeployRequest struct {
	ChallengeID string `json:"challengeId"`
}

type DestroyRequest struct {
	DeploymentID string `json:"deploymentId"`
}

type ValidateRequest struct {
	Flag string `json:"flag"`
}

type ChallengeResponse struct {
	JobID   string `json:"jobId"`
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

type WebhookPayload struct {
	JobName     string            `json:"jobName"`
	BuildNumber int               `json:"buildNumber"`
	Status      string            `json:"status"`
	Params      map[string]string `json:"params,omitempty"`
}

type ContextKey string

const UserIDKey ContextKey = "userId"
