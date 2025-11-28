module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.cluster_name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = data.aws_availability_zones.available.names
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }

  tags = {
    Environment = "production"
    Terraform   = "true"
  }
}

module "ecr" {
  source = "./modules/ecr-mod"
}

module "eks" {
  source = "./modules/eks-mod"
  cluster_name = var.cluster_name
  node_group_name = var.node_group_name
  node_instance_type = var.node_instance_type
  desired_size = var.desired_size
  min_size = var.min_size
  max_size = var.max_size
  private_subnets = module.vpc.private_subnets
  public_subnets = module.vpc.public_subnets
  vpc_id = module.vpc.vpc_id
  region = var.region
  depends_on = [ module.ecr ]
}

module "k8s-manifests" {
  source = "./modules/k8s-resources"
  k8s_manifests_path = "k8s"
  depends_on = [ module.eks ]
  providers = {
    kubernetes = kubernetes
  }
}