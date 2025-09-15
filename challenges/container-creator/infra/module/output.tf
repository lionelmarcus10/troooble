output "instance_id" {
  value = aws_instance.lab_instance.id
}

output "public_ip" {
  value = aws_instance.lab_instance.public_ip
}

output "ssh_command" {
  value = "ssh -i ~/.ssh/id_rsa ec2-user@${aws_instance.lab_instance.public_ip}"
}

output "userfiles_bucket_path" {
  value = "s3://${data.terraform_remote_state.vpc.outputs.bucket_name}/${var.user_infos_as_prefix}/"
}