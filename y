version = 0.1
[default]
[default.deploy]
[default.deploy.parameters]
stack_name = "TodoApp-ini-Dev"
s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-h9051y6ib6fk"
s3_prefix = "TodoApp-ini-Dev"
region = "us-east-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM"
disable_rollback = true
image_repositories = []
