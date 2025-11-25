# import the SSH private keys from the VPC module
data "aws_secretsmanager_secret_version" "ssh_private_key" {
  secret_id = data.terraform_remote_state.vpc.outputs.secretsmanager_ssh_private_key_id
}