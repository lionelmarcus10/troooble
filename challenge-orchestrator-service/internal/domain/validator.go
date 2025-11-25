package domain

import "time"

type ValidationResult struct {
    ID          string
    DeploymentID string
    Step        int
    Name        string
    Ok          bool
    CreatedAt   time.Time
    Message     string
    Output      string
}