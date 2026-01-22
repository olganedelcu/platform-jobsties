# CI/CD Workflows

## CI Pipeline (.github/workflows/ci.yml)

This workflow runs on every push and pull request to the `main` branch.

### What it does:

1. **Checkout** - Gets the latest code
2. **Setup Node** - Installs Node.js 20 with npm caching
3. **Install dependencies** - Runs `npm ci` for clean, reproducible installs
4. **Lint** - Checks code quality with ESLint
5. **Typecheck** - Validates TypeScript types without emitting files
6. **Build** - Creates production build to ensure it compiles successfully
7. **Upload artifacts** - Saves the build output for 7 days (optional)

### Local Testing

Before pushing, you can test locally:

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build the project
npm run build
```

### Troubleshooting

If the CI fails:
- Check the GitHub Actions tab in your repository
- Review the failing step's logs
- Fix issues locally and push again

### Configuration

The workflow uses:
- **Node version**: 20
- **OS**: Ubuntu latest
- **Cache**: npm dependencies for faster builds
