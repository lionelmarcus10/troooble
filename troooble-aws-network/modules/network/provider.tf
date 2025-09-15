terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.95.0"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.1.0"
    }
    
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5.2"
    }

    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.4"
    }
  }
}