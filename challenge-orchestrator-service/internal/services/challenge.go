package services

import (
	"context"
	"log"

	"github.com/google/uuid"
)

type ChallengeService struct {
	jenkins *JenkinsService
}

func NewChallengeService(jenkins *JenkinsService) *ChallengeService {
	return &ChallengeService{jenkins: jenkins}
}

func (s *ChallengeService) Deploy(userID, challengeID string) string {
	jobID := uuid.New().String()

	go func() {
		ctx := context.Background()
		params := map[string]string{
			"USER_ID":      userID,
			"CHALLENGE_ID": challengeID,
			"JOB_ID":       jobID,
		}

		_, err := s.jenkins.TriggerPipeline(ctx, "deploy_challenge", params)
		if err != nil {
			log.Printf("Failed to trigger deploy pipeline: %v", err)
		}

		// TODO : supabase modif à faire (save deployment info)
	}()

	return jobID
}

func (s *ChallengeService) Destroy(userID, deploymentID string) string {
	jobID := uuid.New().String()

	go func() {
		ctx := context.Background()
		params := map[string]string{
			"USER_ID":       userID,
			"DEPLOYMENT_ID": deploymentID,
			"JOB_ID":        jobID,
		}

		_, err := s.jenkins.TriggerPipeline(ctx, "destroy_challenge", params)
		if err != nil {
			log.Printf("Failed to trigger destroy pipeline: %v", err)
		}

		// TODO : supabase modif à faire (update deployment status)
	}()

	return jobID
}

func (s *ChallengeService) Validate(userID, deploymentID, flag string) string {
	jobID := uuid.New().String()

	go func() {
		ctx := context.Background()
		params := map[string]string{
			"USER_ID":       userID,
			"DEPLOYMENT_ID": deploymentID,
			"FLAG":          flag,
			"JOB_ID":        jobID,
		}

		_, err := s.jenkins.TriggerPipeline(ctx, "validate_challenge", params)
		if err != nil {
			log.Printf("Failed to trigger validate pipeline: %v", err)
		}

		// TODO : supabase modif à faire (save validation result)
	}()

	return jobID
}
