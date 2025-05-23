# Deployment Guide

This guide provides instructions for deploying web applications to Azure using the Azure Web App Quickstart Kit.

## Infrastructure as Code

The quickstart kit uses Azure Bicep templates for infrastructure deployment. These templates are located in the `/infra` directory.

### Resource Structure

The infrastructure consists of:

- Azure App Service (Web App)
- Azure Functions App (optional)
- Azure Database for PostgreSQL
- Azure Storage Account
- Azure Key Vault
- Azure Application Insights
- Azure Log Analytics

### Deployment Steps

1. **Prerequisites**
   - Azure CLI installed and logged in
   - Access to an Azure subscription
   - Service Principal with appropriate permissions

2. **Environment Setup**
   - Clone this repository
   - Navigate to the `/infra` directory
   
3. **Deploy Infrastructure**
   ```bash
   ./deploy.sh <environment> [resource_group] [project_name]
   ```
   Example:
   ```bash
   ./deploy.sh dev my-project-rg my-project
   ```

4. **Configure Application Settings**
   - After deployment, configure your application settings in the Azure Portal
   - Set up environment variables required by your application
   - Connect to Key Vault for secure secrets management

## CI/CD Pipeline

The repository includes GitHub Actions workflows for continuous integration and deployment.

### GitHub Actions Setup

1. Configure the following GitHub secrets:
   - `AZURE_CREDENTIALS`: JSON object with Azure service principal credentials
   - `REGISTRY_USERNAME` and `REGISTRY_PASSWORD`: For container registry access

2. The workflow will automatically:
   - Build and test the application
   - Create a Docker image
   - Deploy to Azure App Service

### Manual Deployment

To manually trigger a deployment:

1. Go to the Actions tab in GitHub
2. Select the CI/CD workflow
3. Click "Run workflow"
4. Select the environment and branch

## Environments

The deployment scripts support multiple environments:

- **Development (dev)**: For development and testing
- **Test (test)**: For integration testing
- **Production (prod)**: For production workloads

Each environment can be deployed to a separate resource group with different configurations.

## Database Migrations

For applications using PostgreSQL:

1. Create your database schema and initial migrations
2. Run migrations during the deployment process or manually
3. Configure connection strings in your application settings

## Monitoring and Logging

The deployment includes Application Insights for monitoring:

1. View application performance in the Azure Portal
2. Set up alerts for critical metrics
3. Configure logging levels in your application

## Troubleshooting

Common issues and solutions:

- **Deployment Failures**: Check the GitHub Actions logs for detailed error messages
- **Application Errors**: Review Application Insights logs
- **Database Connection Issues**: Verify firewall rules and connection strings
- **Permission Problems**: Ensure your Service Principal has the required permissions
