# Get VPC info from remote state
data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    bucket = var.bucket_name
    key    = "01_init_vpc/terragrunt.tfstate"
    region = var.aws_region
  }
}

module "ec2-instance" {
  source        = "terraform-aws-modules/ec2-instance/aws"
  version       = "4.2.1"
  ami           = var.ami
  instance_type = var.instancetype
  user_data     = data.template_file.userdata.rendered
  key_name      = aws_key_pair.openvpn.key_name
  associate_public_ip_address = true
  vpc_security_group_ids = [module.security_group.security_group_id]
  subnet_id              = var.subnetid
  iam_instance_profile   = data.terraform_remote_state.vpc.outputs.ssm_profile_name
  enable_volume_tags     = true
  tags = {
    Owner = "${var.owner}"
    Name  = "${var.instancename}"
  }
  root_block_device = [
    {
      encrypted   = true
      volume_type = "gp3"
      throughput  = 200
      volume_size = 13
    },
  ]
}

resource "aws_key_pair" "openvpn" {
  key_name   = "openvpn"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCvjU0julcjCD5DwZImUH7lmqK16SMscDFSDsdsdDFDFsfds4dweZ9cp74N++sudD17Qisrrsd34rlJKCRxr4lvsTnH2leO7pl8QlLSMTXCEjY5StSun66N8B2ocha9TsdHKk2aJCow6Gu+EtjYOqUiUh+mAVylJfa+eZyLeXBtVIRVgOzhaV6bokb+V7aHVMHvs7U1KzQZgOp9l0rXcYfJLQ5VdVVRmN6jRaOsd6mdqyiHlX9TGvco6/dcNFR0YszCB3iredljkxXvNfME400I3WKEmUjn9h6f8Wq4BLMHOPBks6WbfBMweteLHdmSSxmHM0x6r4ccZStp334NQvBWQ8yB1OkAo61Y+bNGLSmRFK0jbVuVsM+B2rUJR2U+DREsiIYy4IQZSM989rRTaIiQ++ODM1tWVwyOKqM2w7qbRK64KegF9cQ10Oxl4riwxTOOnbuIX37ixIw7UjEe0XqhXbg36CKi70OfnERSRU= sgasimov@DESKTOP-97VNMH9"
}

data "template_file" "userdata" {
  template = file("userdata.sh")

  vars = {
    key_country  = "${var.key_country}"
    key_province = "${var.key_province}"
    key_city     = "${var.key_city}"
    key_org      = "${var.key_org}"
    key_email    = "${var.key_email}"
    key_ou       = "${var.key_ou}"
    passwd       = "${var.passwd}"
    domain       = "${var.domain}"
    sslmail      = "${var.sslmail}"
    subdomain    = "${var.subdomain}"
    instancetype = "${var.instancetype}"
    keyname      = "${var.keyname}"
    adminurl     = "${var.domain}"
  }
}

data "aws_vpc" "selected" {
  id = var.vpc
}

