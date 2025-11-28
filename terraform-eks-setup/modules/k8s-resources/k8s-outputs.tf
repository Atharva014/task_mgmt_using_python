output "ingress_hostname" {
  description = "ALB URL from Ingress (may take a few minutes to provision)"
  value       = "Run: kubectl get ingress -n <namespace> to get the ALB URL"
}

output "alb_dns_name" {
  description = "ALB DNS name from the ingress"
  value       = try(data.kubernetes_ingress_v1.main.status[0].load_balancer[0].ingress[0].hostname, "ALB provisioning in progress...")
}