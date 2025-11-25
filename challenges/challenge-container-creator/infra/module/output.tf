output "instance_id" {
  value = aws_instance.lab_instance.id
}

output "public_ip" {
  value = aws_instance.lab_instance.public_ip
}

output "ssh_command" {
  value = "ssh -i ~/.ssh/challenge-vm-id_rsa ec2-user@${aws_instance.lab_instance.public_ip}"
}

output "userfiles_bucket_path" {
  value = "s3://${data.terraform_remote_state.vpc.outputs.bucket_name}/${var.user_infos_as_prefix}/"
}

output "user_password" {
  value = random_password.user_password.result
  sensitive = true
}

output "user_ssh_private_key_s3_path" {
  value = "s3://${data.terraform_remote_state.vpc.outputs.bucket_name}/${var.user_infos_as_prefix}/user_ssh_id_rsa"
}

output "bucket_folder" {
  value = var.bucket_folder
  
}