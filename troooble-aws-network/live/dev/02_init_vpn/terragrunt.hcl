locals {
  stack_vars = read_terragrunt_config(find_in_parent_folders("stack.hcl")).locals
  bucket_name = local.stack_vars.bucket_name
  bucket_folder = "${path_relative_to_include()}"
}

include "stack" {
  path = find_in_parent_folders("stack.hcl")
}

terraform {
  source = "../../../modules/lab_manager_vm"
}

inputs = {

  instance_type = "t4g.medium"
  ami_id        = "ami-0b2f2a5d7a4d7f37f"
  
  bucket_folder = local.bucket_folder
  ingress_ports = [22, 443] 
}