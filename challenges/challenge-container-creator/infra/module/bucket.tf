# Generate SSH key pair for user
resource "tls_private_key" "user_ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}


# Store public key of EC2-user in S3 bucket
resource "aws_s3_object" "user_ssh_public_key" {
  bucket = var.bucket_name
  key    = "${var.user_infos_as_prefix}/user_ssh_id_rsa.pub"
  content = tls_private_key.user_ssh_key.public_key_openssh
  acl   = "private"
}

# Store private key of EC2-user in S3 bucket
resource "aws_s3_object" "user_ssh_private_key" {
  bucket = var.bucket_name
  key    = "${var.user_infos_as_prefix}/user_ssh_id_rsa"
  content = tls_private_key.user_ssh_key.private_key_openssh
  acl   = "private"
}