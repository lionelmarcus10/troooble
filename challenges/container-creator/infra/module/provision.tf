

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
        "sudo yum install -y python3 python3-pip ufw tree ansible -y",
        "sudo dnf install -y firewalld",
    ]
  }

  provisioner "local-exec" {
    command = "rm -rf /tmp/${var.user_infos_as_prefix}"
  }

}