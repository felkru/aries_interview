terraform {
  required_providers {
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
    }
  }
}

provider "mongodbatlas" {
  public_key  = var.atlas_public_key
  private_key = var.atlas_private_key
}

resource "mongodbatlas_project" "smart_reviewer" {
  name   = var.project_name
  org_id = var.atlas_org_id
}

resource "mongodbatlas_cluster" "cluster" {
  project_id   = mongodbatlas_project.smart_reviewer.id
  name         = var.cluster_name
  cluster_type = "REPLICASET"

  provider_name               = "TENANT"
  backing_provider_name       = "AWS"
  provider_region_name        = var.atlas_region
  provider_instance_size_name = "M0"
}

resource "mongodbatlas_database_user" "app_user" {
  username           = var.db_username
  password           = var.db_password
  project_id         = mongodbatlas_project.smart_reviewer.id
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = "smart-reviewer"
  }
}

resource "mongodbatlas_project_ip_access_list" "vercel_access" {
  project_id = mongodbatlas_project.smart_reviewer.id
  cidr_block = "0.0.0.0/0"
  comment    = "Production Vercel Access"
}
