@description('Deployment environment name')
@allowed([
  'dev'
  'test'
  'prod'
])
param env string = 'dev'

@description('Location for all resources')
param location string = resourceGroup().location

@description('Project name used for resource naming')
param projectName string = 'webapp'

@description('PostgreSQL administrator login')
@secure()
param dbAdminLogin string = 'dbadmin'

@description('PostgreSQL administrator password')
@secure()
param dbAdminPassword string

@description('Object ID of the user or service principal for Key Vault access')
param objectId string

@description('Tags to apply to all resources')
param tags object = {
  project: projectName
  environment: env
}

// Variables for resource naming
var resourcePrefix = '${projectName}-${env}'
var webAppName = '${resourcePrefix}-web'
var funcAppName = '${resourcePrefix}-func'
var appServicePlanName = '${resourcePrefix}-asp'
var appInsightsName = '${resourcePrefix}-insights'
var logAnalyticsName = '${resourcePrefix}-logs'
var storageAccountName = replace('${projectName}${env}sa', '-', '')
var keyVaultName = '${resourcePrefix}-kv'
var postgresServerName = '${resourcePrefix}-pg'
var postgresDatabaseName = projectName

// Deploy monitoring resources
module monitoring './modules/monitoring.bicep' = {
  name: 'monitoringDeploy'
  params: {
    appInsightsName: appInsightsName
    logAnalyticsName: logAnalyticsName
    location: location
    tags: tags
  }
}

// Deploy App Service
module appService './modules/app-service.bicep' = {
  name: 'appServiceDeploy'
  params: {
    appServicePlanName: appServicePlanName
    webAppName: webAppName
    location: location
    tags: tags
    appInsightsConnectionString: monitoring.outputs.appInsightsConnectionString
  }
}

// Deploy PostgreSQL
module postgresql './modules/postgresql.bicep' = {
  name: 'postgresqlDeploy'
  params: {
    serverName: postgresServerName
    databaseName: postgresDatabaseName
    location: location
    tags: tags
    administratorLogin: dbAdminLogin
    administratorLoginPassword: dbAdminPassword
  }
}

// Deploy Storage Account
module storage './modules/storage.bicep' = {
  name: 'storageDeploy'
  params: {
    storageAccountName: storageAccountName
    location: location
    tags: tags
  }
}

// Deploy Key Vault
module keyVault './modules/key-vault.bicep' = {
  name: 'keyVaultDeploy'
  params: {
    keyVaultName: keyVaultName
    location: location
    tags: tags
    objectId: objectId
  }
}

// Outputs
output webAppName string = webAppName
output webAppUrl string = appService.outputs.webAppUrl
output functionAppName string = funcAppName
output appInsightsConnectionString string = monitoring.outputs.appInsightsConnectionString
output storageAccountName string = storage.outputs.storageAccountName
output blobEndpoint string = storage.outputs.blobEndpoint
output keyVaultName string = keyVault.outputs.keyVaultName
output keyVaultUri string = keyVault.outputs.keyVaultUri
output postgresServerName string = postgresql.outputs.serverName
output postgresServerFqdn string = postgresql.outputs.serverFqdn
output postgresDatabaseName string = postgresql.outputs.databaseName
