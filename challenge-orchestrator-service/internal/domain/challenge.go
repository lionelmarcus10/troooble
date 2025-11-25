package domain

import "time"


type ChallengeStatus string

const (
	StatusInitializing ChallengeStatus = "initializing"
	StatusInProgress ChallengeStatus = "in progress"
	StatusActive     ChallengeStatus = "active"
	StatusSucceeded  ChallengeStatus = "succeeded"
)

func (s ChallengeStatus) IsValidChallengeStatus() bool {
	switch s {
	case StatusInProgress, StatusActive, StatusSucceeded, StatusInitializing:
		return true
	default:
		return false
	}
}

type Challenge struct {
    ID          string
    Name        string
    Description string
    CreatedAt   time.Time
	UpdatedAt   time.Time
	Manifest    string // path or S3 URI to manifest file
	Status      ChallengeStatus
}

