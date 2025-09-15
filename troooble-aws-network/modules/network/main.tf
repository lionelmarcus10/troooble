provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {}
}

# Create a VPC
resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr
  enable_network_address_usage_metrics = true
  enable_dns_support = true
  enable_dns_hostnames = true
  
  tags = merge(
    var.tags, { Name = var.name }
  )
}

# Create an Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = merge(
    var.tags, { Name = "${var.name}-igw" }
  )
}

# Create Public Subnets
resource "aws_subnet" "public-subnet" {
  for_each = { 
    for idx, cidr in var.public_subnets : idx => cidr
  }
  vpc_id = aws_vpc.vpc.id
  cidr_block = each.value
  availability_zone = element(var.availability_zone, tonumber(each.key))
  map_public_ip_on_launch = false
  tags = merge(
    var.tags, { Name = "${var.name}-public-${each.key}" }
  )
  depends_on = [aws_vpc.vpc]
}

# Create Private Subnets
resource "aws_subnet" "private-subnet" {
  for_each = { 
    for idx, cidr in var.private_subnets : idx => cidr
  }
  vpc_id = aws_vpc.vpc.id
  cidr_block = each.value
  availability_zone = element(var.availability_zone, tonumber(each.key))
  tags = merge(
    var.tags, { Name = "${var.name}-private-${each.key}" }
  )
  map_public_ip_on_launch = false
  depends_on = [aws_vpc.vpc]
}

# Create Elastic IPs for public subnets
resource "aws_eip" "nat" {
  for_each = aws_subnet.public-subnet
  tags = merge(
    var.tags, { Name = "${var.name}-nat-eip-${each.key}" }
  )
}

# Attribute ip to nat gateway on each public subnet
resource "aws_nat_gateway" "nat" {
  for_each = aws_subnet.public-subnet
  allocation_id = aws_eip.nat[each.key].id
  subnet_id     = aws_subnet.public-subnet[each.key].id
  tags = merge(
    var.tags, { Name = "${var.name}-nat-${each.key}" }
  )
}
