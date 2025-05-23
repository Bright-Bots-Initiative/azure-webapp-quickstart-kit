@description('Server Name for Azure Database for PostgreSQL')
param serverName string

@description('Database Name')
param databaseName string = 'webapp'

@description('Location for all resources')
param location string = resourceGroup().location

@description('PostgreSQL Server administrator login name')
@secure()
param administratorLogin string

@description('PostgreSQL Server administrator password')
@secure()
param administratorLoginPassword string

@description('PostgreSQL Server version')
@allowed([
  '11'
  '12'
  '13'
  '14'
])
param postgresVersion string = '14'

@description('PostgreSQL Server SKU')
param skuName string = 'B_Gen5_1'

@description('PostgreSQL Server storage size in GB')
param storageSizeGB int = 5

@description('Tags to apply to all resources')
param tags object = {}

// Create PostgreSQL Server
resource postgresServer 'Microsoft.DBforPostgreSQL/servers@2017-12-01' = {
  name: serverName
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: substring(skuName, 0, indexOf(skuName, '_'))
  }
  properties: {
    version: postgresVersion
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    sslEnforcement: 'Enabled'
    storageProfile: {
      storageMB: storageSizeGB * 1024
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
  }
}

// Create PostgreSQL Database
resource postgresDatabase 'Microsoft.DBforPostgreSQL/servers/databases@2017-12-01' = {
  parent: postgresServer
  name: databaseName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.UTF8'
  }
}

// Allow Azure services to access PostgreSQL
resource allowAzureIPs 'Microsoft.DBforPostgreSQL/servers/firewallRules@2017-12-01' = {
  parent: postgresServer
  name: 'AllowAllAzureIPs'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Outputs
output serverName string = postgresServer.name
output serverFqdn string = postgresServer.properties.fullyQualifiedDomainName
output databaseName string = postgresDatabase.name
output connectionString string = 'postgres://${administratorLogin}@${serverName}:${administratorLoginPassword}@${serverName}.postgres.database.azure.com:5432/${databaseName}'
