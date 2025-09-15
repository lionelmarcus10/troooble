
# Create Route Tables and Associations
resource "aws_route_table" "public-rt" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = merge(
    var.tags, { Name = "${var.name}-public-rt" }
  )
}

# Create private route tables and associate with NAT gateways
resource "aws_route_table" "private-rt" {
  for_each = aws_subnet.private-subnet
  vpc_id = aws_vpc.vpc.id
  
  # Route to internet via NAT Gateway
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat[each.key].id
  }
  
  tags = merge(var.tags, { Name = "${var.name}-private-rt-${each.key}" })
}

# Note: No explicit routes needed for private → public subnet communication
# AWS automatically creates a "local" route for the VPC CIDR that handles intra-VPC traffic

# Associate public subnets with the public route table
resource "aws_route_table_association" "public_assoc" {
  for_each = aws_subnet.public-subnet
  subnet_id = each.value.id
  route_table_id = aws_route_table.public-rt.id
}



# Associate private subnets with their respective private route tables
resource "aws_route_table_association" "private_assoc" {
  for_each = aws_subnet.private-subnet
  subnet_id = each.value.id
  route_table_id = aws_route_table.private-rt[each.key].id
}

