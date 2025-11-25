
variable "name" {
    type = string
}

variable "aws_region" {
    type = string
}

variable "vpc_cidr" {
    type = string
}

variable "public_subnets" {
    type = list(string) 
}

variable "private_subnets" {
    type = list(string) 
}

variable "availability_zone" {
    type = list(string) 
}

variable "tags" {
    type = map(string)
    default = {}
}

variable "bucket_name" {
    type = string
}

variable "bucket_folder" {
    type = string 
}

variable "enable_nat_gateway" {
    type    = bool
    default = false
}