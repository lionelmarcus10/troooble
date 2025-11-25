variable "region" {
  description = "AWS region"
}

variable "instance_type" {
  description = "EC2 instance type"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance (Ubuntu 22.04 in us-east-1)"
}

variable "user_infos_as_prefix" {
  description = "User information prefix for S3 bucket"
}

variable "user_spec" {
  description = "User specification for resources (s3 bucket, ec2 name, username...)"
}

variable "instance_name" {
  description = "Name tag for the EC2"
}

variable "open_ports" {
  description = "List of integer ports to open in SG (ex: [22,80,5000])"
  type        = list(number)
}

variable "backend_port" {
  description = "Backend container port"
}

variable "frontend_port" {
  description = "Frontend container port"
}

variable "bucket_name" {
  description = "S3 bucket name to store user files"
}

variable "bucket_folder" {
  description = "S3 bucket folder to store user files"
}