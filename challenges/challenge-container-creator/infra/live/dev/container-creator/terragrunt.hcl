locals {
  root_vars = read_terragrunt_config(find_in_parent_folders("root.hcl")).locals
  user_spec = local.root_vars.user_spec
  bucket_folder = "${path_relative_to_include()}"
}


include "stack" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "../../../module"
}


inputs = {
  # Provider / infra
  region               = "us-east-1"
  instance_type        = "t4g.nano" # t4g.nano minimum
  ami_id               = "ami-0b2f2a5d7a4d7f37f"
  bucket_folder        = local.bucket_folder
  # Identification
  instance_name        = local.user_spec

  open_ports           = [22, 80, 5000]

  # Ports internes des containers
  backend_port         = 5000
  frontend_port        = 80
  # User info for S3 key prefix
  user_infos_as_prefix = "${path_relative_to_include()}/${local.user_spec}"
}
