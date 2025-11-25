package main

import "challenge-orchestrator-service/internal/app"

func main() {
	queue := adapters.NewQueue()
	exec := adapters.NewValidatorExecutor()
	repo := adapters.NewPostgresRepo()

	svc := app.ValidatorRunner{Executor: exec, Repo: repo}

	queue.Subscribe("deployments", func(depID string) {
		// simulate deployment finished
		repo.UpdateDeploymentStatus(depID, "deployed")
		svc.RunValidation(depID)
	})
}