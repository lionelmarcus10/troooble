# Security group for VPC endpoints
resource "aws_security_group" "ssm_endpoint_sg" {
  name        = "ssm-endpoint-sg"
  description = "Security group for SSM VPC endpoints"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.tags,
    {
      Name = "ssm-endpoint-sg"
    }
  )
}