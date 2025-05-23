# Azure Deployment Configuration

## Hosting Service
Azure App Service – Linux Web App for Containers

The React front-end is built into a Docker image and pushed to GitHub Packages. Azure App Service pulls and runs that container. The API lives in a separate Azure Functions app (also Linux).

## App Service Configuration Parameters
These settings should be configured in the Azure portal or through the Azure CLI:

| Key | Example Value | Purpose |
|-----|--------------|---------|
| FUNCTION_APP_BASE_URL | https://your-function-app.azurewebsites.net/api | Front-end hits Functions here |
| FUNCTION_APP_KEY | <functions default host key> | Sent as x-functions-key header |
| POSTGRES_URL | postgres://admin:pw@your-postgres-server.postgres.database.azure.com:5432/your-database | For future API calls |
| NODE_ENV | production | Bundler hint |
| WEBSITE_NODE_DEFAULT_VERSION | 18 (or 20) | Ensure correct Node runtime |
| APPLICATIONINSIGHTS_CONNECTION_STRING | InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://... | Connects application to Application Insights |

## Monitoring Configuration
This application uses Azure Application Insights and Log Analytics for monitoring and logging. For detailed instructions on setting up monitoring, see [Azure Monitoring Configuration](./docs/azure/monitoring.md).

## Frontend URL
After deployment, your app will be available at: https://your-app-name.azurewebsites.net
For custom domains, configure them in the Azure Portal under your App Service's Custom Domains section.
