package app

import (
	"challenge-orchestrator-service/internal/domain"
	"context"
)

type ValidationService struct {
    Repo Repository
    Exec ValidatorRunner // optional: only if you run validations here
}

// Trigger + persist new validation (optional flow)
func (s *ValidationService) RunValidation(ctx context.Context, deploymentID string) (domain.ValidationResult, error) {

	deployment, err := s.Repo.GetDeployment(ctx, deploymentID)
	if err != nil {

		return domain.ValidationResult{}, err
	}

	challenge, err := s.Repo.GetChallenge(ctx, deployment.ChallengeID)
	if err != nil {
		return domain.ValidationResult{}, err
	}

	res, err := s.Exec.RunValidation(ctx, deployment, challenge.Manifest)
	if err != nil {
		return domain.ValidationResult{}, err
	}

	// assuming Repo has SaveValidation()
	if err := s.Repo.SaveValidationResult(ctx, res); err != nil {
		return domain.ValidationResult{}, err
	}
	return res, nil
}


// GetValidationResult fetches validation results for a deployment
func (s *ValidationService) GetValidationResult(ctx context.Context, deploymentID string) (domain.ValidationResult, error) {
	return s.Repo.GetValidationResult(ctx, deploymentID)
}