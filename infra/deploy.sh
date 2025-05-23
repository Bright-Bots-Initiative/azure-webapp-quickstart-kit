#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh <environment> [resource_group] [project_name]"
  echo "Example: ./deploy.sh dev my-project-rg my-project"
  exit 1
fi

ENV=$1
PROJECT_NAME=${3:-"webapp"}
RESOURCE_GROUP=${2:-"${PROJECT_NAME}-${ENV}-rg"}
LOCATION="centralus"

echo "=== Deploying infrastructure to $RESOURCE_GROUP ($ENV environment) ==="

if ! az group show --name $RESOURCE_GROUP &> /dev/null; then
  echo "Creating resource group $RESOURCE_GROUP in $LOCATION..."
  az group create --name $RESOURCE_GROUP --location $LOCATION --tags project=$PROJECT_NAME environment=$ENV createdBy=script
fi

echo "Deploying Bicep templates..."
DEPLOYMENT_NAME="${PROJECT_NAME}-${ENV}-$(date +%Y%m%d%H%M%S)"

az deployment group create \
  --name $DEPLOYMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --template-file ./main.bicep \
  --parameters env=$ENV projectName=$PROJECT_NAME

echo "=== Deployment complete ==="
echo "Resource group: $RESOURCE_GROUP"
echo "Deployment name: $DEPLOYMENT_NAME"

echo "=== Deployment outputs ==="
az deployment group show \
  --resource-group $RESOURCE_GROUP \
  --name $DEPLOYMENT_NAME \
  --query properties.outputs
