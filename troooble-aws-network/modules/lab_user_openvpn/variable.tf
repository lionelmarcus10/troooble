#default AMI is Canonical, Ubuntu, 22.04 LTS, amd64 jammy image build on 2022-12-06
variable "ami" {
  description = "AMI to be used, default is Ubuntu 22.04 Bionic"
  default     = "ami-0ff39345bd62c82a5"
}

#we are using us-east-2 region for this project
variable "region" {
  description = "AWS Region"
  default     = "us-east-2"
}

variable "vpc" {
  description = "AWS VPC"
  default     = "your_vpc"
}

variable "instancetype" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "instancename" {
  description = "EC2 instance name"
  default     = "Openvpn"
}

# you don't need to provide instance_id
variable "instance_id" {
  default = ""
}

variable "keyname" {
  description = "SSH key name"
  default     = "openvpn"
}

variable "key_country" {
  default = "US"
}

variable "key_province" {
  default = "US_State for ex. IL"
}

variable "key_city" {
  default = "Your city"
}

variable "key_org" {
  default = "for ex. McDonalds"
}

variable "key_email" {
  default = "youremail"
}

variable "key_ou" {
  default = "any letter/word"
}

variable "passwd" {
  description = "OpenVPN admin password"
  default     = ""
  sensitive   = true
}

variable "domain" {
  description = "OpenVPN server TLD"
  default     = "use your doamin"
}

variable "sslmail" {
  description = "E-Mail for LetsEncrypt"
  default     = "youremail"
}

variable "owner" {
  description = "Owner Tag for AWS console"
  default     = "openvpn"
}

variable "subdomain" {
  description = "Subdomain"
  default     = "vpn"
}

variable "subnetid" {
  description = "Subnet for the VPN Instance"
  default     = "your_subnet"
}

variable "adminurl" {
  description = "OpenVPN Admin login"
  default     = "openvpn"
}