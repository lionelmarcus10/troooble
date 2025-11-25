output "instance_id" {
  value = aws_instance.lab_manager_instance.id
}

output "public_ip" {
  value = aws_instance.lab_manager_instance.public_ip
}

output "ssh_command" {
  value = "ssh -i ~/.ssh/challenge-vm-id_rsa ec2-user@${aws_instance.lab_manager_instance.public_ip}"
}
