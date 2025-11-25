# aws rights to attribute and others todo
resource "aws_iam_user" "lab_manager_service_account" {
    name = "lab-manager-service-account"
    path = "/system/"
}

resource "aws_iam_access_key" "lab_manager_key" {
    user = aws_iam_user.lab_manager_service_account.name
}

resource "aws_iam_user_policy" "lab_manager_policy" {
    name = "lab-manager-policy"
    user = aws_iam_user.lab_manager_service_account.name

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow"
                Action = [
                    "ec2:*",
                    "s3:*",
                    "iam:PassRole"
                ]
                Resource = "*"
            }
        ]
    })
}

