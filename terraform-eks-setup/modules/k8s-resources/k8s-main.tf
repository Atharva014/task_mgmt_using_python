# Backend Service
resource "kubernetes_manifest" "backend_service" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/backend-service.yaml"))
}

# Frontend Service
resource "kubernetes_manifest" "frontend_service" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/frontend-service.yaml"))
}

# Database Setup
resource "kubernetes_manifest" "postgres_storage_class" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/postgres-storage-class.yaml"))
}

resource "kubernetes_manifest" "postgres_pvc" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/postgres-pvc.yaml"))

  depends_on = [
    kubernetes_manifest.postgres_storage_class
  ]
}

resource "kubernetes_manifest" "postgres_deployment" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/postgres-deployment.yaml"))

  depends_on = [
    kubernetes_manifest.postgres_pvc
  ]
}

resource "kubernetes_manifest" "postgres_service" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/postgres-service.yaml"))

  depends_on = [
    kubernetes_manifest.postgres_deployment
  ]
}

# ConfigMap Setup
resource "kubernetes_manifest" "configmap" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/configmap.yaml"))

  depends_on = [
    kubernetes_manifest.postgres_service
  ]
}

# Deployments
resource "kubernetes_manifest" "backend_deployment" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/backend-deployment.yaml"))

  depends_on = [
    kubernetes_manifest.configmap,
    kubernetes_manifest.postgres_service,
    kubernetes_manifest.backend_service
  ]
}

resource "kubernetes_manifest" "frontend_deployment" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/frontend-deployment.yaml"))

  depends_on = [
    kubernetes_manifest.configmap,
    kubernetes_manifest.frontend_service
  ]
}

# Ingress
resource "kubernetes_manifest" "ingress" {
  manifest = yamldecode(file("${path.root}/${var.k8s_manifests_path}/ingress.yaml"))

  depends_on = [
    kubernetes_manifest.backend_deployment,
    kubernetes_manifest.frontend_deployment,
    kubernetes_manifest.backend_service,
    kubernetes_manifest.frontend_service,
  ]
}