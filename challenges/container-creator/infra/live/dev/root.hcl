locals {
  bucket_name = "troooble-dev-bucket"
  user_spec = "container-creator-u1"
}

# store tfstate in S3
remote_state {
  backend = "s3"
  config = {
    bucket         = local.bucket_name
    key            = "${path_relative_to_include()}/${local.user_spec}.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}