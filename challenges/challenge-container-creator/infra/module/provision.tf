

# Generate templated ansible files
resource "local_file" "ansible_files" {
  for_each = {
    for file in fileset("${path.module}/ansible", "**/*") : file => file
    if !endswith(file, ".terragrunt-source-manifest")
  }
  
  
  content = templatefile("${path.module}/ansible/${each.value}", {
    # Add your template variables here
    backend_port  = var.backend_port
    frontend_port = var.frontend_port
    username      = var.user_spec
    user_password = random_password.user_password.result
    user_ssh_public_key = tls_private_key.user_ssh_key.public_key_openssh
  })
  
  filename = "/tmp/${var.user_infos_as_prefix}/${each.value}"
  file_permission = "0644"

}

resource "null_resource" "copy_ansible_files" {

  depends_on = [local_file.ansible_files, aws_instance.lab_instance, data.aws_secretsmanager_secret_version.ssh_private_key]

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = data.aws_secretsmanager_secret_version.ssh_private_key.secret_string
    host        = aws_instance.lab_instance.public_ip
    timeout     = "5m"
    
    # Additional SSH options to handle key issues
    agent       = false
  }
    
  provisioner "file" {
    source      = "/tmp/${var.user_infos_as_prefix}/"
    destination = "/home/ec2-user/"
  }

  provisioner "remote-exec" {
    inline = [
      "#!/bin/bash",
        "sudo yum update -y",
        "sudo yum install -y python3 python3-pip tree ansible -y",
        "sudo dnf install -y firewalld",
        "cd /home/ec2-user/setup",
        "ansible-playbook playbook.yml"
    ]
  }

  provisioner "local-exec" {
    command = "rm -rf /tmp/${var.user_infos_as_prefix}"
  }

  triggers = {
    # Run when ansible files change
    ansible_files_hash = sha256(join("", [for f in local_file.ansible_files : f.content]))
    # Run when instance changes
    instance_id = aws_instance.lab_instance.id
  }
}