@description('Storage Account Name')
param storageAccountName string

@description('Location for all resources')
param location string = resourceGroup().location

@description('Storage Account SKU')
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
  'Standard_ZRS'
  'Premium_LRS'
  'Premium_ZRS'
])
param storageSku string = 'Standard_LRS'

@description('Tags to apply to all resources')
param tags object = {}

@description('Enable blob versioning')
param enableBlobVersioning bool = false

@description('Enable hierarchical namespace (for Data Lake Storage)')
param enableHierarchicalNamespace bool = false

// Create Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-05-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: storageSku
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
    encryption: {
      services: {
        blob: {
          enabled: true
        }
        file: {
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    isHnsEnabled: enableHierarchicalNamespace
  }
}

// Create Blob Service
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2022-05-01' = {
  parent: storageAccount
  name: 'default'
  properties: {
    isVersioningEnabled: enableBlobVersioning
    deleteRetentionPolicy: {
      enabled: true
      days: 7
    }
    containerDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

// Create a container for uploads
resource uploadContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-05-01' = {
  parent: blobService
  name: 'uploads'
  properties: {
    publicAccess: 'None'
  }
}

// Create a container for static assets
resource staticContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-05-01' = {
  parent: blobService
  name: 'static'
  properties: {
    publicAccess: 'Blob'
  }
}

// Outputs
output storageAccountName string = storageAccount.name
output storageAccountId string = storageAccount.id
output blobEndpoint string = storageAccount.properties.primaryEndpoints.blob
output uploadContainerName string = uploadContainer.name
output staticContainerName string = staticContainer.name
