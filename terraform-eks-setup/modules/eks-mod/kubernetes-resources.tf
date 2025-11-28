# Create the service account for EBS CSI Controller
resource "kubernetes_service_account" "ebs_csi_controller" {
  metadata {
    name      = "ebs-csi-controller-sa"
    namespace = "kube-system"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.ebs_csi_controller.arn
    }
    labels = {
      "app.kubernetes.io/name"       = "aws-ebs-csi-driver"
      "app.kubernetes.io/managed-by" = "terraform"
    }
  }
  depends_on = [aws_iam_role_policy_attachment.ebs_csi_controller]
}

# Service Account for AWS Load Balancer Controller
resource "kubernetes_service_account" "aws_load_balancer_controller" {
  metadata {
    name      = "aws-load-balancer-controller"
    namespace = "kube-system"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.alb_controller.arn
    }
    labels = {
      "app.kubernetes.io/name"       = "aws-load-balancer-controller"
      "app.kubernetes.io/managed-by" = "terraform"
    }
  }
  depends_on = [aws_iam_role_policy_attachment.alb_controller]
}