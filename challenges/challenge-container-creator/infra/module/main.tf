
# Generate random password for user
resource "random_password" "user_password" {
  length  = 16
  special = true
  upper   = true
  lower   = true
  numeric = true
}

terraform {
  backend "s3" {}
}

# Get VPC info from remote state
data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    bucket = "troooble-dev-bucket"
    key    = "01_init_vpc/terragrunt.tfstate"
    region = "us-east-1"
  }
}

resource "aws_instance" "lab_instance" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = data.terraform_remote_state.vpc.outputs.challenge_vm_keypair_name
  subnet_id              = data.terraform_remote_state.vpc.outputs.public_subnet_ids[0]
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  associate_public_ip_address = true
  iam_instance_profile = data.terraform_remote_state.vpc.outputs.ssm_profile_name

  tags = {
    Name = var.instance_name
  }
}
