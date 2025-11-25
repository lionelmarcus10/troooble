variable "instance_type" {
    description = "EC2 instance type"
    type        = string
}

variable "ami_id" {
    description = "AMI ID for the EC2 instance"
    type        = string
}

variable "bucket_folder" {
    description = "Folder in the S3 bucket to store user files"
    type        = string
}

variable "aws_region" {
    description = "AWS region"
    type        = string
}

variable "vpc_cidr" {
    description = "VPC CIDR block"
    type        = string
}

variable "instance_name" {
    description = "Name of the EC2 instance"
    type        = string
}

# variable "public_subnets" {
#     description = "List of public subnet CIDR blocks"
#     type        = list(string)
# }

# variable "private_subnets" {
#     description = "List of private subnet CIDR blocks"
#     type        = list(string)
# }

# variable "availability_zone" {
#     description = "List of availability zones"
#     type        = list(string)
# }

variable "tags" {
    description = "Map of tags to assign to resources"
    type        = map(string)
    default     = {}
}

variable "bucket_name" {
    description = "S3 bucket name"
    type        = string
}

variable "ingress_ports" {
  description = "List of integer ports to open in SG (ex: [22,80,5000])"
  type        = list(number)
}
