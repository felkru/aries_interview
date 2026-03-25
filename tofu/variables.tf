variable "atlas_org_id" {
  type        = string
  description = "MongoDB Atlas Organization ID"
}

variable "atlas_public_key" {
  type        = string
  description = "MongoDB Atlas Public API Key"
}

variable "atlas_private_key" {
  type        = string
  description = "MongoDB Atlas Private API Key"
  sensitive   = true
}

variable "project_name" {
  type        = string
  description = "Name of the Atlas Project"
  default     = "smart-reviewer"
}

variable "cluster_name" {
  type        = string
  description = "Name of the MongoDB Cluster"
  default     = "smart-reviewer"
}

variable "atlas_region" {
  type        = string
  description = "AWS region for the cluster"
  default     = "EU_WEST_1"
}

variable "db_username" {
  type        = string
  description = "Database User Username"
  default     = "appUser"
}

variable "db_password" {
  type        = string
  description = "Database User Password"
  sensitive   = true
}
