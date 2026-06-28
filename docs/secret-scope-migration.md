# Secret Scope Migration

## Breaking change

`secret_scope_name` is now isolated per deployment target instead of shared across all environments.

- dev: `hi_genie_dev_credentials`
- staging: `hi_genie_staging_credentials`

The previously shared scope, `hi_genie_credentials`, is no longer the default for bundle deployments.

## One-time migration

Databricks secret values cannot be read back via the CLI. Operators must re-provision every required secret value into the new target-specific scopes.

Secrets to migrate:

- `jwt_signing_key`
- `dcr_shared_secret`
- `github_client_id`
- `github_client_secret`

`github_client_id` and `github_client_secret` are stubs for Known Gap O2 and can be any non-empty string until real GitHub OAuth app credentials are provisioned.

## Commands

```bash
# Create new dev scope
databricks secrets create-scope hi_genie_dev_credentials

# Re-provision each secret (replace <value> with actual secret):
databricks secrets put-secret hi_genie_dev_credentials jwt_signing_key --string-value <value>
databricks secrets put-secret hi_genie_dev_credentials dcr_shared_secret --string-value <value>
databricks secrets put-secret hi_genie_dev_credentials github_client_id --string-value <stub>
databricks secrets put-secret hi_genie_dev_credentials github_client_secret --string-value <stub>
```

For staging, create and populate `hi_genie_staging_credentials` the same way before the first staging deployment.
