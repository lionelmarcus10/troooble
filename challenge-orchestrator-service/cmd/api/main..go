package main

import (
	"log"
	"net/http"
	"os"

	"challenge-orchestrator-service/internal/config"
	"challenge-orchestrator-service/internal/handlers"
	"challenge-orchestrator-service/internal/middleware"
	"challenge-orchestrator-service/internal/services"

	scalar "github.com/MarceloPetrucio/go-scalar-api-reference"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	cfg := config.Load()

	jenkinsService := services.NewJenkinsService(cfg.JenkinsURL, cfg.JenkinsUser, cfg.JenkinsToken)
	challengeService := services.NewChallengeService(jenkinsService)

	authMiddleware := middleware.NewAuthMiddleware(cfg.SupabaseURL, cfg.SupabaseKey)
	challengeHandler := handlers.NewChallengeHandler(challengeService)
	webhookHandler := handlers.NewWebhookHandler()

	r := chi.NewRouter()

	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("challenge-orchestrator-service"))
	})

	if cfg.EnableDocs {
		r.Get("/docs", func(w http.ResponseWriter, r *http.Request) {
			specContent, err := os.ReadFile("documentation/openapi.json")
			if err != nil {
				http.Error(w, "Failed to load API spec: "+err.Error(), http.StatusInternalServerError)
				return
			}
			htmlContent, err := scalar.ApiReferenceHTML(&scalar.Options{
				SpecContent: string(specContent),
				CustomOptions: scalar.CustomOptions{
					PageTitle: "Challenge Orchestrator API",
				},
				DarkMode: true,
			})
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "text/html")
			w.Write([]byte(htmlContent))
		})
		log.Println("API docs enabled at /docs")
	}

	r.Route("/challenges", func(r chi.Router) {
		r.Use(authMiddleware.Authenticate)
		r.Post("/deploy", challengeHandler.Deploy)
		r.Post("/{id}/destroy", challengeHandler.Destroy)
		r.Post("/{id}/validate", challengeHandler.Validate)
	})

	r.Post("/jenkins/webhook", webhookHandler.JenkinsCallback)

	log.Printf("Server starting on port %s", cfg.ServerPort)
	http.ListenAndServe(":"+cfg.ServerPort, r)
}
