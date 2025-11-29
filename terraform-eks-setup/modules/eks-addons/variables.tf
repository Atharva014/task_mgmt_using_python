variable "cluster_name" {
  type = string
}

variable "region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "ebs_csi_controller_role_arn" {
  type = string
}

variable "alb_controller_role_arn" {
  type = string
}