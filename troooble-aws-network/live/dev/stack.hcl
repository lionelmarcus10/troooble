locals {
  bucket_name = "troooble-dev-bucket"
  aws_region  = "us-east-1"
  vpc_cidr   = "10.1.0.0/16"
  public_subnets = ["10.1.1.0/24", "10.1.3.0/24"]
  private_subnets = ["10.1.2.0/24", "10.1.4.0/24"]
  availability_zone = ["us-east-1a", "us-east-1b", "us-east-1c"]
  tags = {
    Environment = "dev"
    Project     = "troooble"
  }


}

# store tfstate in S3
remote_state {
  backend = "s3"
  config = {
    bucket         = local.bucket_name
    key            = "${path_relative_to_include()}/terragrunt.tfstate"
    region         = local.aws_region
    encrypt        = true
    
  }
}


inputs = {
  aws_region = local.aws_region
  vpc_cidr = local.vpc_cidr
  public_subnets  = local.public_subnets
  private_subnets = local.private_subnets
  availability_zone = local.availability_zone
  tags = local.tags
  bucket_name = local.bucket_name
}