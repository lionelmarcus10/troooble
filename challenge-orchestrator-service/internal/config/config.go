package config

import (
	"os"
)

type Config struct {
	SupabaseURL   string
	SupabaseKey   string
	JenkinsURL    string
	JenkinsUser   string
	JenkinsToken  string
	ServerPort    string
	EnableDocs    bool
}

func Load() *Config {
	return &Config{
		SupabaseURL:  getEnv("SUPABASE_URL", ""),
		SupabaseKey:  getEnv("SUPABASE_KEY", ""),
		JenkinsURL:   getEnv("JENKINS_URL", ""),
		JenkinsUser:  getEnv("JENKINS_USER", ""),
		JenkinsToken: getEnv("JENKINS_TOKEN", ""),
		ServerPort:   getEnv("SERVER_PORT", "5000"),
		EnableDocs:   getEnv("ENABLE_DOCS", "false") == "true",
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
