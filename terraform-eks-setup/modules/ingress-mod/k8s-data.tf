# Data source to fetch ingress details (optional, for automation)
data "kubernetes_ingress_v1" "main" {
  metadata {
    name      = try(kubernetes_manifest.ingress.manifest.metadata.name, "ingress-name")
    namespace = try(kubernetes_manifest.ingress.manifest.metadata.namespace, "default")
  }

  depends_on = [kubernetes_manifest.ingress]
}