provider "aws" {
  region = var.aws_region
}

# create S3 bucket
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
  tags = merge(
    var.tags, { Name = var.bucket_name }
  )
}

# enable versioning for S3 bucket
resource "aws_s3_bucket_versioning" "bucket_versioning_config" {
  bucket = aws_s3_bucket.bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# block public access to S3 bucket
resource "aws_s3_bucket_public_access_block" "block" {
  bucket = aws_s3_bucket.bucket.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}


