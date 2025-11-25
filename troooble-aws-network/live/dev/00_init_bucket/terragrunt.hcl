locals {
  stack_vars = read_terragrunt_config(find_in_parent_folders("stack.hcl")).locals
  bucket_name = local.stack_vars.bucket_name
  aws_region = local.stack_vars.aws_region
}

terraform {
  source = "../../../modules/init_bucket"
}

inputs = {
  aws_region = local.aws_region
  bucket_name = local.bucket_name
  tags = {
    Environment = "dev"
    Project     = "troooble"
  }
}