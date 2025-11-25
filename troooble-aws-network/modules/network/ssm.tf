resource "aws_iam_role" "ssm_role" {
  name = "TrooobleSSMRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_attach" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}


resource "aws_iam_instance_profile" "ssm_profile" {
  name = "TrooobleSSMInstanceProfile"
  role = aws_iam_role.ssm_role.name
}


##########################################
## VPC Endpoint for SSM
##########################################

resource "aws_vpc_endpoint" "ssm" {
  vpc_id              = aws_vpc.vpc.id
  service_name        = "com.amazonaws.${var.aws_region}.ssm"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = values(aws_subnet.private-subnet)[*].id
  security_group_ids  = [aws_security_group.ssm_endpoint_sg.id]
  private_dns_enabled = true
  tags                = merge(
    var.tags,
    {
      Name = "ssm-vpc-endpoint"
    }
  )
  
  depends_on = [ aws_security_group.ssm_endpoint_sg ]

}

resource "aws_vpc_endpoint" "ssmmessages" {
  vpc_id              = aws_vpc.vpc.id
  service_name        = "com.amazonaws.${var.aws_region}.ssmmessages"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = values(aws_subnet.private-subnet)[*].id
  security_group_ids  = [aws_security_group.ssm_endpoint_sg.id]
  private_dns_enabled = true
  tags                = merge(
    var.tags,
    {
      Name = "ssmmessages-vpc-endpoint"
    }
  )
  
  depends_on = [ aws_security_group.ssm_endpoint_sg ]

}

resource "aws_vpc_endpoint" "ec2messages" {
  vpc_id              = aws_vpc.vpc.id
  service_name        = "com.amazonaws.${var.aws_region}.ec2messages"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = values(aws_subnet.private-subnet)[*].id
  security_group_ids  = [aws_security_group.ssm_endpoint_sg.id]
  private_dns_enabled = true
  tags                = merge(
    var.tags,
    {
      Name = "ec2messages-vpc-endpoint"
    }
  )

  depends_on = [ aws_security_group.ssm_endpoint_sg ]
}

