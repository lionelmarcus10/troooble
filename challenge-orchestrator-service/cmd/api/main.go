package main

import (
    "challenge-orchestrator-service/internal/app"
    "challenge-orchestrator-service/internal/api"
    "challenge-orchestrator-service/internal/domain"
    "context"
    "fmt"
    "log"
)

// ----------------------
// In-memory adapters for MVP
// ----------------------
type InMemoryRepo struct {
    challenges  map[string]domain.Challenge
    deployments map[string]domain.Deployment
    results     map[string][]domain.ValidationResult
}

func NewInMemoryRepo() *InMemoryRepo {
    return &InMemoryRepo{
        challenges:  make(map[string]domain.Challenge),
        deployments: make(map[string]domain.Deployment),
        results:     make(map[string][]domain.ValidationResult),
    }
}

// Implement Repo interface methods (Save/Get/Update...)
func (r *InMemoryRepo) SaveChallenge(ctx context.Context, c domain.Challenge) error {
    r.challenges[c.ID] = c
    return nil
}
func (r *InMemoryRepo) GetChallenge(ctx context.Context, id string) (domain.Challenge, error) {
    c, ok := r.challenges[id]
    if !ok {
        return domain.Challenge{}, fmt.Errorf("challenge not found")
    }
    return c, nil
}
func (r *InMemoryRepo) SaveDeployment(ctx context.Context, d domain.Deployment) error {
    r.deployments[d.ID] = d
    return nil
}
func (r *InMemoryRepo) GetDeployment(ctx context.Context, id string) (domain.Deployment, error) {
    d, ok := r.deployments[id]
    if !ok {
        return domain.Deployment{}, fmt.Errorf("deployment not found")
    }
    return d, nil
}
func (r *InMemoryRepo) UpdateDeployment(ctx context.Context, d domain.Deployment) error {
    r.deployments[d.ID] = d
    return nil
}
func (r *InMemoryRepo) SaveValidationResults(ctx context.Context, results []domain.ValidationResult) error {
    if len(results) == 0 {
        return nil
    }
    r.results[results[0].DeploymentID] = results
    return nil
}

// Add missing method to satisfy app.Repository interface
func (r *InMemoryRepo) SaveValidationResult(ctx context.Context, result domain.ValidationResult) error {
    // Append the result to the slice for the deployment
    r.results[result.DeploymentID] = append(r.results[result.DeploymentID], result)
    return nil
}
func (r *InMemoryRepo) GetValidationResults(ctx context.Context, deploymentID string) ([]domain.ValidationResult, error) {
    return r.results[deploymentID], nil
}

// Add missing method to satisfy app.Repository interface
func (r *InMemoryRepo) GetValidationResult(ctx context.Context, id string) (domain.ValidationResult, error) {
    // Search for the validation result by ID in all results
    for _, results := range r.results {
        for _, result := range results {
            if result.ID == id {
                return result, nil
            }
        }
    }
    return domain.ValidationResult{}, fmt.Errorf("validation result not found")
}

// ----------------------
// Dummy Deployer & Validator
// ----------------------
type DummyDeployer struct{}
func (d *DummyDeployer) Deploy(ctx context.Context, c domain.Challenge, userID string) (domain.Deployment, error) {
    return domain.Deployment{
        ID:          "deploy-" + c.ID,
        ChallengeID: c.ID,
        UserID:      userID,
        InstanceID:  []string{"i-dummy"},
        Status:      "running",
    }, nil
}
func (d *DummyDeployer) Destroy(ctx context.Context, deployment domain.Deployment) error { return nil }
func (d *DummyDeployer) Status(ctx context.Context, deployment domain.Deployment) (string, error) {
    return string(deployment.Status), nil
}
// Add missing method to satisfy app.ChallengeDeployer interface
func (d *DummyDeployer) UpdateDeploymentStatus(deploymentID string, status string) error {
    // Dummy implementation: do nothing and return nil
    return nil
}

type DummyValidator struct{}
func (v *DummyValidator) Run(ctx context.Context, deployment domain.Deployment, validatorFile string) ([]domain.ValidationResult, error) {
    return []domain.ValidationResult{
        {ID: "val-1", DeploymentID: deployment.ID, Step: 1, Name: "Dummy Test", Ok: true, Message: "Passed", Output: "ok"},
    }, nil
}

// ----------------------
// Main
// ----------------------
func main() {
    repo := NewInMemoryRepo()
    deployer := &DummyDeployer{}
    validator := &DummyValidator{}

    deployService := &app.DeployChallengeService{
        Deployer:  deployer,
        Repo:      repo,
    }

    
    serverAddr := ":8080"
    fmt.Printf("Starting Challenge Manager API on %s\n", serverAddr)
    log.Fatal(api.StartServer(serverAddr, deployService))
}
