@description('Key Vault Name')
param keyVaultName string

@description('Location for all resources')
param location string = resourceGroup().location

@description('Object ID of the user or service principal that will have access to the Key Vault')
param objectId string

@description('Tags to apply to all resources')
param tags object = {}

@description('SKU name for the Key Vault')
@allowed([
  'standard'
  'premium'
])
param skuName string = 'standard'

// Create Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: true
    tenantId: subscription().tenantId
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: objectId
        permissions: {
          keys: [
            'get'
            'list'
            'create'
            'delete'
            'update'
          ]
          secrets: [
            'get'
            'list'
            'set'
            'delete'
          ]
          certificates: [
            'get'
            'list'
            'create'
            'delete'
            'update'
          ]
        }
      }
    ]
    sku: {
      name: skuName
      family: 'A'
    }
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// Create sample secrets
resource jwtSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  parent: keyVault
  name: 'JWT-SECRET'
  properties: {
    value: 'placeholder-replace-with-actual-secret'
  }
}

resource dbConnectionString 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  parent: keyVault
  name: 'DB-CONNECTION-STRING'
  properties: {
    value: 'placeholder-replace-with-actual-connection-string'
  }
}

// Outputs
output keyVaultName string = keyVault.name
output keyVaultUri string = keyVault.properties.vaultUri
