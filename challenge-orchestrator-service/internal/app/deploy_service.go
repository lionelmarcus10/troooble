package app

import (
	"challenge-orchestrator-service/internal/domain"
	"context"
	"fmt"
	"time"
)

// DeployChallengeService orchestrates challenge deployment workflows.
// It depends on domain-defined ports (interfaces), injected at construction.
type DeployChallengeService struct {
	Deployer  ChallengeDeployer // responsible for provisioning/destroying infra
	Repo      Repository        // persistence layer (DB, in-memory, etc.)
}

// DeployChallenge executes the workflow of deploying a challenge for a user.
// 1. Save challenge definition
// 2. Deploy infrastructure
// 3. Save deployment record
// 4. Optionally run validators asynchronously
func (s *DeployChallengeService) DeployChallenge(
	ctx context.Context,
	c domain.Challenge,
	userID string,
) (*domain.Deployment, error) {

	// Step 1: persist challenge
	if err := s.Repo.SaveChallenge(ctx, c); err != nil {
		return nil, fmt.Errorf("failed to save challenge: %w", err)
	}

	// Step 2: invoke deployment
	deployment, err := s.Deployer.Deploy(ctx, c, userID)
	if err != nil {
		// mark as failed and persist
		c.Status = "failed"
		_ = s.Repo.SaveChallenge(ctx, c)
		return nil, fmt.Errorf("deployment failed: %w", err)
	}

	// Step 3: persist deployment record
	if err := s.Repo.SaveDeployment(ctx, deployment); err != nil {
		return nil, fmt.Errorf("failed to save deployment: %w", err)
	}

	return &deployment, nil
}

// DestroyDeployment tears down a running deployment and marks it destroyed.
func (s *DeployChallengeService) DestroyDeployment(ctx context.Context, deployment domain.Deployment) error {
	if err := s.Deployer.Destroy(ctx, deployment); err != nil {
		return fmt.Errorf("failed to destroy deployment: %w", err)
	}
	deployment.Status = domain.DeploymentStatusDestroyed
	deployment.UpdatedAt = time.Now()
	return s.Repo.UpdateDeployment(ctx, deployment)
}

// GetDeploymentStatus queries the underlying Deployer for live status
// and updates the repository to keep records in sync.
func (s *DeployChallengeService) GetDeploymentStatus(ctx context.Context, deploymentID string) (string, error) {
	// Fetch deployment from repo
	deployment, err := s.Repo.GetDeployment(ctx, deploymentID)
	if err != nil {
		return "", fmt.Errorf("deployment not found: %w", err)
	}

	// Query actual infra provider via Deployer
	status, err := s.Deployer.Status(ctx, deployment)
	if err != nil {
		return "", fmt.Errorf("failed to get status: %w", err)
	}

	// Update repository with latest status
	deployment.Status = domain.DeploymentStatus(status)
	if err := s.Repo.UpdateDeployment(ctx, deployment); err != nil {
		return "", fmt.Errorf("failed to update deployment: %w", err)
	}

	return status, nil
}


