provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {}
}

# Get VPC info from remote state
data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    bucket = var.bucket_name
    key    = "01_init_vpc/terragrunt.tfstate"
    region = var.aws_region
  }
}

resource "aws_instance" "lab_manager_instance" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = data.terraform_remote_state.vpc.outputs.challenge_vm_keypair_name
  subnet_id              = data.terraform_remote_state.vpc.outputs.private_subnet_ids[0]
  vpc_security_group_ids = [aws_security_group.manager_vm_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = var.instance_name
  }
  iam_instance_profile = data.terraform_remote_state.vpc.outputs.ssm_profile_name

  provisioner "file" {
    source      = "ansible/"
    destination = "/home/ec2-user/ansible"
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = data.aws_secretsmanager_secret_version.ssh_private_key.secret_string
      host        = self.public_ip
      timeout     = "5m"
      # Additional SSH options to handle key issues
      agent       = false
    }
  }
}