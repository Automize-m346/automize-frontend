variable "location" {
  description = "Azure region"
  type        = string
  default     = "switzerlandnorth"
}

variable "resource_group_name" {
  type = string
}

variable "app_service_plan_name" {
  type = string
}

variable "web_app_name" {
  type = string
}

variable "docker_image" {
  description = "Full Docker image name"
  type        = string
}

variable "ghcr_username" {
  description = "GHCR username"
  type        = string
  sensitive   = true
}

variable "ghcr_token" {
  description = "GHCR personal access token"
  type        = string
  sensitive   = true
}
