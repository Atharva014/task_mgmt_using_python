output "cluster_id" {
  description = "EKS cluster ID"
  value       = module.eks.cluster_id
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = module.eks.cluster_name
}

output "region" {
  description = "AWS region"
  value       = var.region
}

output "configure_kubectl" {
  description = "Configure kubectl command"
  value       = "aws eks update-kubeconfig --region ${var.region} --name ${var.cluster_name}"
}

output "backend_repo_url" {
  value = module.ecr.backend_repo_url
}

output "frontend_repo_url" {
  value = module.ecr.frontend_repo_url
}

output "ingress_hostname" {
  description = "ALB URL from Ingress (may take a few minutes to provision)"
  value       = "Run: kubectl get ingress -n <namespace> to get the ALB URL"
}

output "alb_dns_name" {
  description = "ALB DNS name from the ingress"
  value       = module.ingress.alb_dns_name
}