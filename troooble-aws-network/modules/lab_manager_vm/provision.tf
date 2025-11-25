resource "null_resource" "copy_ansible_files" {
  depends_on = [aws_instance.lab_manager_instance, data.aws_secretsmanager_secret_version.ssh_private_key]

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = data.aws_secretsmanager_secret_version.ssh_private_key.secret_string
    host        = aws_instance.lab_manager_instance.public_ip
    timeout     = "5m"
    
    # Additional SSH options to handle key issues
    agent       = false
  }
    
  provisioner "file" {
    source      = "${path.module}/ansible/"
    destination = "/home/ec2-user/"
  }

  provisioner "remote-exec" {
    inline = [
      "#!/bin/bash",
        "sudo yum update -y",
        "sudo yum install -y python3 python3-pip tree ansible -y",
    ]
  }

}