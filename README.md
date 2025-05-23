# Azure Web App Quickstart Kit

A comprehensive DevOps automation kit for deploying modern web applications to Azure.

![Azure Web App Quickstart Kit](https://docs.microsoft.com/en-us/azure/app-service/media/app-service-web-get-started-nodejs-portal/app-service-web-nodejs-running.png)

## 📋 Step-by-Step Deployment Guide

This guide will walk you through the complete process of deploying a web application to Azure using this kit.

### Prerequisites

Before you begin, ensure you have the following installed and configured:

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (version 2.30.0 or later)
  ```bash
  # Verify installation
  az --version
  
  # Login to Azure
  az login
  ```

- [Node.js](https://nodejs.org/) (version 18 or later)
  ```bash
  # Verify installation
  node --version
  npm --version
  ```

- [Git](https://git-scm.com/)
  ```bash
  # Verify installation
  git --version
  ```

- An active Azure subscription
  ```bash
  # Verify subscription
  az account show
  ```

### Step 1: Clone the Repository

```bash
git clone https://github.com/Bright-Bots-Initiative/azure-webapp-quickstart-kit.git
cd azure-webapp-quickstart-kit
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create your environment file from the template:

```bash
cp .env.example .env
```

Edit the `.env` file with your specific configuration:

```bash
# Server configuration
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=your_secret_key_here

# Database connection (for local development)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webapp
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### Step 4: Test the Application Locally

Start the development server:

```bash
npm run dev
```

This will start both the frontend and backend servers. The application should be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

Verify that the application is working correctly by:
1. Opening the frontend URL in your browser
2. Testing the login functionality
3. Accessing protected routes

### Step 5: Deploy Infrastructure to Azure

```bash
# Set your deployment variables
ENVIRONMENT="dev"
PROJECT_NAME="mywebapp"
RESOURCE_GROUP="${PROJECT_NAME}-${ENVIRONMENT}-rg"
LOCATION="eastus"

# Create resource group if it doesn't exist
az group create --name $RESOURCE_GROUP --location $LOCATION

# Deploy infrastructure using Bicep templates
cd infra
./deploy.sh $ENVIRONMENT $RESOURCE_GROUP $PROJECT_NAME
```

The deployment script will:
1. Create all necessary Azure resources
2. Configure the resources with proper settings
3. Output the deployment results, including resource URLs

### Step 6: Configure CI/CD Pipeline

1. Fork this repository to your GitHub account
2. Set up GitHub Actions secrets:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `AZURE_CREDENTIALS`: JSON output from the following command:
       ```bash
       az ad sp create-for-rbac --name "myapp-cicd" --role contributor \
         --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
         --sdk-auth
       ```
     - `REGISTRY_USERNAME`: Your container registry username
     - `REGISTRY_PASSWORD`: Your container registry password

3. Customize the workflow file (`.github/workflows/ci-cd.yml`) if needed

### Step 7: Deploy Your Application

Push your changes to the main branch to trigger the CI/CD pipeline:

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

Monitor the deployment in the GitHub Actions tab of your repository.

### Step 8: Access Your Deployed Application

After successful deployment, your application will be available at:
- Web App URL: `https://{project-name}-{environment}-web.azurewebsites.net`
- API URL: `https://{project-name}-{environment}-api.azurewebsites.net`

## 🔧 Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| **Azure CLI authentication fails** | Run `az login` to authenticate with your Azure account |
| **Deployment fails with permission errors** | Ensure your service principal has Contributor role on the resource group |
| **Database connection fails** | Check firewall rules to allow connections from your App Service |
| **App Service shows 503 errors** | Check application logs in Azure Portal → App Service → Logs |
| **CI/CD pipeline fails** | Verify GitHub secrets are correctly configured |
| **Bicep template validation errors** | Run `az deployment group validate` to test templates before deployment |

### Viewing Logs

```bash
# View App Service logs
az webapp log tail --name {app-name} --resource-group {resource-group}

# Download logs
az webapp log download --name {app-name} --resource-group {resource-group}
```

### Restarting Services

```bash
# Restart App Service
az webapp restart --name {app-name} --resource-group {resource-group}

# Restart Database
az postgres server restart --name {db-name} --resource-group {resource-group}
```

## 🚀 Features

- **Infrastructure as Code (IaC)**: Bicep templates for all Azure resources
- **CI/CD Pipelines**: GitHub Actions workflows for automated deployment
- **Environment Management**: Parameterized scripts for dev, test, and prod environments
- **Monitoring & Alerts**: Application Insights integration and dashboard templates
- **Security Best Practices**: Secure secrets management and role-based access

## 🏗️ Azure Resources

This kit provides templates for deploying the following Azure resources:

- App Service (for FE/BE hosting)
- Azure Database for PostgreSQL
- Storage Account (for file uploads/assets)
- Resource Group (to manage all resources as a unit)
- App Insights (for observability/logging)
- Key Vault (for managing secrets)

## 🛠️ Technologies Used

This project is built with a modern web technology stack:

- **Frontend:**
  - React
  - Vite
  - TypeScript
  - Tailwind CSS
  - React Router (for navigation)
  - Context API (for state management)
- **Backend:**
  - Node.js with Express.js
  - PostgreSQL (for database)
  - JSON Web Tokens (JWT) for authentication
  - bcryptjs for password hashing
- **Infrastructure:**
  - Azure Bicep (for IaC)
  - GitHub Actions (for CI/CD)
  - Docker (for containerization)
- **Testing:**
  - Vitest (for unit/integration tests)
  - Cypress (for End-to-End tests)
- **Development Tools:**
  - ESLint (for linting)

## 📁 Project Structure

```
├── infra/              # Infrastructure as Code (Bicep templates)
│   ├── modules/        # Reusable Bicep modules
│   │   ├── app-service.bicep
│   │   ├── key-vault.bicep
│   │   ├── monitoring.bicep
│   │   ├── postgresql.bicep
│   │   └── storage.bicep
│   ├── main.bicep      # Main Bicep template
│   └── deploy.sh       # Deployment script
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API service integration
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry point for the React app
├── server.cjs          # Backend Express server
├── .github/workflows/  # GitHub Actions workflows
├── docs/               # Documentation
│   └── deployment/     # Deployment guides
├── examples/           # Example implementations
│   └── advanced/       # Advanced usage examples
├── README.md           # This file
└── package.json        # Project dependencies and scripts
```

## 📚 Additional Documentation

- [Detailed Deployment Guide](./docs/deployment/guide.md)
- [Infrastructure Documentation](./infra/README.md)
- [CI/CD Pipeline Configuration](./docs/deployment/pipeline.md)
- [Advanced Examples](./examples/README.md)

## 🎬 Demo Video

[![Azure Web App Quickstart Kit Demo](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)

*Note: Replace YOUTUBE_VIDEO_ID_HERE with your actual YouTube video ID when available.*

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for more information on how to contribute.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
