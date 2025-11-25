locals {
  stack_vars = read_terragrunt_config(find_in_parent_folders("stack.hcl")).locals
  bucket_folder = "${path_relative_to_include()}"
  aws_region = local.stack_vars.aws_region
}

include "stack" {
  path = find_in_parent_folders("stack.hcl")
}

terraform {
  source = "../../../modules/network"
}

inputs = {
  name = "troooble-dev-vpc"
  bucket_folder = local.bucket_folder
  aws_region = local.aws_region
  enable_nat_gateway   = false
}
