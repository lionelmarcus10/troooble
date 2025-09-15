locals {
  stack_vars = read_terragrunt_config(find_in_parent_folders("stack.hcl")).locals
  bucket_name = local.stack_vars.bucket_name
}

include "stack" {
  path = find_in_parent_folders("stack.hcl")
}

terraform {
  source = "../../../modules/network"
}

inputs = {
  
  name = "troooble-dev-vpc"

  aws_region = "us-east-1"
  
  vpc_cidr = "10.1.0.0/16"
  
  
  public_subnets = ["10.1.1.0/24", "10.1.3.0/24"]
  
  private_subnets = ["10.1.2.0/24", "10.1.4.0/24"]

  availability_zone = ["us-east-1a", "us-east-1b", "us-east-1c"]
  
  tags = {
    Environment = "dev"
    Project     = "troooble"
  }
  
  bucket_name = local.bucket_name
  bucket_folder = "${path_relative_to_include()}"

}