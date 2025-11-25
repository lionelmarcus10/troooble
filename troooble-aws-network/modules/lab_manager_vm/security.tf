resource "aws_security_group" "manager_vm_sg" {
  name        = "${var.instance_name}-sg"
  description = "Security group for admin lab manager instance"
  vpc_id      = data.terraform_remote_state.vpc.outputs.vpc_id

  # ingress from other private subnets
  # dynamic "ingress" {
  #   for_each = var.ingress_ports
  #   content {
  #     from_port   = ingress.value
  #     to_port     = ingress.value
  #     protocol    = "-1"
  #     cidr_blocks = [for item in data.terraform_remote_state.vpc.outputs.private_subnet_ids: item]
  #   }
  # }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
