# Backend Service
resource "kubernetes_manifest" "backend_service" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/backend-service.yaml"))
}

# Frontend Service
resource "kubernetes_manifest" "frontend_service" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/frontend-service.yaml"))
}

# Ingress
resource "kubernetes_manifest" "backend_ingress" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/backend-ingress.yaml"))

  depends_on = [
    kubernetes_manifest.backend_service,
    kubernetes_manifest.frontend_service,
  ]
}

resource "kubernetes_manifest" "frontend_ingress" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/frontend-ingress.yaml"))

  depends_on = [
    kubernetes_manifest.backend_service,
    kubernetes_manifest.frontend_service,
  ]
}