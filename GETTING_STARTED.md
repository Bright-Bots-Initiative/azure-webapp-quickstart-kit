# Getting Started with Azure Web App Quickstart Kit

This guide will help you quickly deploy a modern web application to Azure using our DevOps Automation Kit.

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed and logged in
- [Node.js](https://nodejs.org/) (v18 or later)
- [Git](https://git-scm.com/)
- An Azure subscription

## Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/azure-webapp-quickstart-kit.git
cd azure-webapp-quickstart-kit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your specific configuration
```

### 4. Deploy Infrastructure to Azure

```bash
cd infra
./deploy.sh dev my-project-rg my-project
```

This script will:
- Create a resource group if it doesn't exist
- Deploy all necessary Azure resources using Bicep templates
- Configure the resources with proper settings

### 5. Deploy Your Application

The CI/CD pipeline will automatically deploy your application when you push to the main branch. For manual deployment:

```bash
npm run build
cd infra
./deploy-app.sh dev my-project-rg my-project
```

### 6. Access Your Application

After deployment, your application will be available at:
`https://your-app-name-dev-web.azurewebsites.net`

## What's Included

- **Infrastructure as Code**: Bicep templates for all Azure resources
- **CI/CD Pipeline**: GitHub Actions workflows for automated deployment
- **Sample Application**: A minimal React/Node.js application with database integration
- **Multi-Environment Support**: Configurations for dev, test, and production environments

## Next Steps

- [Detailed Deployment Guide](./docs/deployment/guide.md)
- [Infrastructure Documentation](./infra/README.md)
- [CI/CD Pipeline Configuration](./docs/deployment/pipeline.md)
- [Advanced Examples](./examples/README.md)

## Troubleshooting

If you encounter issues during deployment:

1. Check the Azure Portal for resource-specific errors
2. Review the GitHub Actions workflow logs
3. Ensure your Azure credentials are correctly configured
4. Verify your environment variables are properly set

For more detailed troubleshooting, see our [Troubleshooting Guide](./docs/troubleshooting.md).
