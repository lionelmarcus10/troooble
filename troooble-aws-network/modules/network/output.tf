output "vpc_id" {
    value = aws_vpc.vpc.id
}

output "public_subnet_ids" {
    value = [for s in aws_subnet.public-subnet : s.id]
}

output "private_subnet_ids" {
    value = [for s in aws_subnet.private-subnet : s.id]
}

output "nat_gateway_ids" {
    value = [for n in aws_nat_gateway.nat : n.id]
}

output "bucket_name" {
    value = aws_s3_bucket.bucket.bucket
}

output "user_public_key_id" {
    value = aws_s3_object.challenge_ssh_public_key.id
}

output "user_private_key_id" {
    value = aws_s3_object.challenge_ssh_private_key.id
}

output "challenge_vm_keypair_name" {
    value = aws_key_pair.instance_pubkey.key_name
}

output "secretsmanager_ssh_private_key_id" {
    value = aws_secretsmanager_secret.ssh_private_key.id
}

output "secretsmanager_ssh_public_key_id" {
    value = aws_secretsmanager_secret.ssh_public_key.id
}