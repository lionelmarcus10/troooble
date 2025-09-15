locals {
  bucket_name = "troooble-dev-bucket"
}

# store tfstate in S3
remote_state {
  backend = "s3"
  config = {
    bucket         = local.bucket_name
    key            = "${path_relative_to_include()}/troooble-vpc.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}