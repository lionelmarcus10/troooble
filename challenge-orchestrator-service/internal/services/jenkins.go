package services

import (
	"context"
	"log"

	"github.com/bndr/gojenkins"
)

type JenkinsService struct {
	client *gojenkins.Jenkins
}

func NewJenkinsService(url, user, token string) *JenkinsService {
	ctx := context.Background()
	jenkins := gojenkins.CreateJenkins(nil, url, user, token)

	_, err := jenkins.Init(ctx)
	if err != nil {
		log.Printf("Warning: Failed to initialize Jenkins client: %v", err)
	}

	return &JenkinsService{client: jenkins}
}

func (j *JenkinsService) TriggerPipeline(ctx context.Context, pipelineName string, params map[string]string) (int64, error) {
	queueID, err := j.client.BuildJob(ctx, pipelineName, params)
	if err != nil {
		return 0, err
	}
	return queueID, nil
}
