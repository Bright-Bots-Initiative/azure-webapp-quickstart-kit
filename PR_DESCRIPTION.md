# Azure Web App Quickstart Kit

This PR creates a new DevOps Automation Kit repository based on the BrightBoost codebase, with all BrightBoost-specific configurations, secrets, and proprietary code removed.

## Changes Made

### Infrastructure as Code (IaC)
- Created a proper `/infra` directory structure with modular Bicep templates
- Added templates for App Service, PostgreSQL, Storage Account, Key Vault, and App Insights
- Created parameterized deployment scripts supporting multiple environments (dev/test/prod)
- Added comprehensive documentation for Azure deployment

### Code Cleanup
- Removed all BrightBoost-specific configurations and secrets
- Replaced hardcoded credentials with environment variable templates
- Updated color scheme references from BrightBoost-specific to generic webapp colors
- Renamed BrightBoostRobot component to AppMascot for generic usage
- Simplified the application to a minimal working FE/BE/DB integration

### Student Module Relocation
- Moved all student-related components to `/examples/advanced/student-modules/`
- Created clear documentation for the student modules
- Ensured no commented-out student code remains in main files

### Documentation
- Added comprehensive deployment guide
- Created README with clear instructions for getting started
- Added MIT license for open-source usage

## Testing
- Verified all BrightBoost-specific references are removed from the main codebase
- Ensured the application structure follows best practices for a quickstart template

## Next Steps
The repository is ready to be published as a public DevOps Automation Kit for Azure web applications.

Link to Devin run: https://app.devin.ai/sessions/d2489b4db58148b59eaf8fc5a0002ba0
Requested by: nwalker@brightbotsint.com
