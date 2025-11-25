package app

import "context"
import "challenge-orchestrator-service/internal/domain"

// ---------------------------
// Ports (interfaces)
// ---------------------------

// ChallengeDeployer provisions and destroys challenge infra.
type ChallengeDeployer interface {
	Deploy(ctx context.Context, challenge domain.Challenge, userID string) (domain.Deployment, error)
	Destroy(ctx context.Context, deployment domain.Deployment) error
	Status(ctx context.Context, deployment domain.Deployment) (string, error)
	UpdateDeploymentStatus(id string, status string) error
}

// ValidatorRunner executes validations against a deployment.
type ValidatorRunner interface {
	RunValidation(ctx context.Context, deployment domain.Deployment, validatorFile string) (domain.ValidationResult, error)
}

// CloudProvider abstracts a specific infra provider (AWS/GCP/Azure/local).
type CloudProvider interface {
	UploadChallenge(ctx context.Context, challenge domain.Challenge) (string, error)
	RunCommand(ctx context.Context, instanceID, user, command string, timeout int) (string, string, int, error)
	TerminateInstance(ctx context.Context, instanceID string) error
	GetInstanceStatus(ctx context.Context, instanceID string) (string, error)
}

// Queue defines an async job dispatcher (e.g. Kafka, RabbitMQ, NATS).
type Queue interface {
	Publish(ctx context.Context, topic string, payload []byte) error
	Consume(ctx context.Context, topic string, handler func([]byte) error) error
}

// Repository persists domain entities (DB, memory, etc.).
type Repository interface {
	SaveChallenge(ctx context.Context, c domain.Challenge) error
	GetChallenge(ctx context.Context, id string) (domain.Challenge, error)
	SaveDeployment(ctx context.Context, d domain.Deployment) error
	GetDeployment(ctx context.Context, id string) (domain.Deployment, error)
	UpdateDeployment(ctx context.Context, d domain.Deployment) error
	SaveValidationResult(ctx context.Context, result domain.ValidationResult) error
	GetValidationResult(ctx context.Context, deploymentID string) (domain.ValidationResult, error)
}
