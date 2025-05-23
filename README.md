# Azure Web App Quickstart Kit

A comprehensive DevOps automation kit for deploying modern web applications to Azure.

## Features

- **Infrastructure as Code (IaC)**: Bicep templates for all Azure resources
- **CI/CD Pipelines**: GitHub Actions workflows for automated deployment
- **Environment Management**: Parameterized scripts for dev, test, and prod environments
- **Monitoring & Alerts**: Application Insights integration and dashboard templates
- **Security Best Practices**: Secure secrets management and role-based access

## Azure Resources

This kit provides templates for deploying the following Azure resources:

- App Service (for FE/BE hosting)
- Azure Database for PostgreSQL
- Storage Account (for file uploads/assets)
- Resource Group (to manage all resources as a unit)
- App Insights (for observability/logging)
- Key Vault (for managing secrets)

## Technologies Used

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

## Getting Started

To get a local copy up and running, follow these simple steps.

**Prerequisites:**
- Azure CLI
- Node.js (v18 or later)
- GitHub account

**Installation & Setup:**

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Bright-Bots-Initiative/azure-webapp-quickstart-kit.git
   cd azure-webapp-quickstart-kit
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and update it with your values:
   ```sh
   cp .env.example .env
   ```

4. **Deploy to Azure:**
   ```sh
   cd infra
   ./deploy.sh dev myproject-rg myproject
   ```

## Project Structure

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

## Deployment

This project is configured for deployment to Azure using GitHub Actions. For detailed deployment instructions, see the [Deployment Guide](./docs/deployment/guide.md).

The deployment pipeline:
1. Builds and tests the application
2. Creates a Docker image and pushes it to GitHub Container Registry
3. Deploys the application to Azure App Service
4. Sets up all required Azure resources using Bicep templates

## Examples

The repository includes example implementations for various scenarios:

- Basic web application
- API endpoints
- User authentication
- Advanced examples in `/examples` directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
