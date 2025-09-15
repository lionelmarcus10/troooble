resource "tls_private_key" "generated" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "instance_pubkey" {
  key_name   = "challenge-vm-key-keypair"
  public_key = tls_private_key.generated.public_key_openssh

  tags = merge(
    var.tags,
    {
      Name = "key_pair_challenge-vm"
    }
  )
}

# Store public key of EC2-user in S3 bucket
resource "aws_s3_object" "challenge_ssh_public_key" {
  bucket = var.bucket_name
  key    = "${var.bucket_folder}/challenge-vm-id_rsa.pub"
  content = tls_private_key.generated.public_key_openssh
  acl   = "private"
}

# Store private key of EC2-user in S3 bucket
resource "aws_s3_object" "challenge_ssh_private_key" {
  bucket = var.bucket_name
  key    = "${var.bucket_folder}/challenge-vm-id_rsa"
  content = tls_private_key.generated.private_key_openssh
  acl   = "private"
}

resource "aws_secretsmanager_secret" "ssh_private_key" {
  name = "challenge-vm-ssh-private-key"
}

resource "aws_secretsmanager_secret_version" "ssh_private_key" {
  secret_id     = aws_secretsmanager_secret.ssh_private_key.id
  secret_string = tls_private_key.generated.private_key_openssh
}

resource "aws_secretsmanager_secret" "ssh_public_key" {
  name = "challenge-vm-ssh-public-key"
}

resource "aws_secretsmanager_secret_version" "ssh_public_key" {
  secret_id     = aws_secretsmanager_secret.ssh_public_key.id
  secret_string = tls_private_key.generated.public_key_openssh
}
