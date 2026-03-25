output "project_id" {
  value = data.mongodbatlas_project.smart_reviewer.id
}

output "cluster_connection_string" {
  value     = mongodbatlas_cluster.cluster.connection_strings[0].standard_srv
  sensitive = true
}
