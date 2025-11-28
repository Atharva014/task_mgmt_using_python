output "cluster_id" {
  description = "EKS cluster ID"
  value       = aws_eks_cluster.main.id
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = aws_eks_cluster.main.name
}

output "cluster_certificate_authority" {
  description = "Base64 encoded certificate data for the cluster"
  value       = aws_eks_cluster.main.certificate_authority[0].data
  sensitive   = true
}

output "oidc_provider_arn" {
  description = "ARN of the OIDC Provider for EKS"
  value       = aws_iam_openid_connect_provider.cluster.arn
}

output "oidc_provider_url" {
  description = "URL of the OIDC Provider"
  value       = aws_iam_openid_connect_provider.cluster.url
}

output "ebs_csi_controller_role_arn" {
  description = "ARN of the EBS CSI Controller IAM Role"
  value       = aws_iam_role.ebs_csi_controller.arn
}

output "alb_controller_role_arn" {
  description = "ARN of the AWS Load Balancer Controller IAM Role"
  value       = aws_iam_role.alb_controller.arn
}

output "alb_controller_policy_arn" {
  description = "ARN of the AWS Load Balancer Controller IAM Policy"
  value       = aws_iam_policy.alb_controller.arn
}

output "alb_controller_ready" {
  value = helm_release.aws_load_balancer_controller.status
}