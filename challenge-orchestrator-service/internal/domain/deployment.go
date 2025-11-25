package domain	

import "time"

type DeploymentStatus string

const (
    DeploymentStatusPending   DeploymentStatus = "pending"
    DeploymentStatusRunning   DeploymentStatus = "running"
    DeploymentStatusFailed    DeploymentStatus = "failed"
    DeploymentStatusFinished DeploymentStatus = "finished"
    DeploymentStatusDestroyed DeploymentStatus = "destroyed"
)

func (s DeploymentStatus) IsValidDeploymentStatus() bool {
	switch s {
	case DeploymentStatusPending, DeploymentStatusRunning, DeploymentStatusFinished, DeploymentStatusFailed, DeploymentStatusDestroyed:
		return true
	default:
		return false
	}
}

type Deployment struct {
    ID          string
    ChallengeID string
    UserID      string
    InstanceID  []string
    Status      DeploymentStatus
    CreatedAt   time.Time
    UpdatedAt   time.Time
}