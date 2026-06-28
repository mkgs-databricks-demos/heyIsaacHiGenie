# Secret Scope Migration

## Breaking change

`secret_scope_name` is now isolated per deployment target instead of shared across all environments.

- dev: `dev_<user_handle>_hi_genie_credentials`, for example `dev_matthew_giglia_hi_genie_credentials`
- staging: `hi_genie_staging_credentials`

The previously shared scope, `hi_genie_credentials`, is no longer the default for bundle deployments.

DABs `mode: development` auto-prefixes schemas, jobs, pipelines, and similar resources, but it does not auto-prefix Databricks secret scopes. Embedding `user_handle` in the dev scope name is the manual equivalent of the development prefix and gives each developer isolated secrets on a shared workspace.

## One-time migration

Databricks secret values cannot be read back via the CLI. Operators must re-provision every required secret value into the new target-specific scopes.

Manually provisioned secrets to migrate:

- `jwt_signing_key`
- `dcr_shared_secret`
- `github_client_id`
- `github_client_secret`

`github_client_id` and `github_client_secret` are stubs for Known Gap O2 and can be any non-empty string until real GitHub OAuth app credentials are provisioned.

Deploy-managed secret:

- `persona_issuer`

`persona_issuer` is written automatically by `deploy.sh` on every app deploy using the resolved app name, workspace ID, and cloud. Operators do not need to provision it manually, but every target scope will contain this key after the first successful app deploy.

## Commands

```bash
# Create a new dev scope for your user handle.
# Example user_handle: matthew_giglia
databricks secrets create-scope dev_matthew_giglia_hi_genie_credentials

# Re-provision each secret (replace <value> with actual secret):
databricks secrets put-secret dev_matthew_giglia_hi_genie_credentials jwt_signing_key --string-value <value>
databricks secrets put-secret dev_matthew_giglia_hi_genie_credentials dcr_shared_secret --string-value <value>
databricks secrets put-secret dev_matthew_giglia_hi_genie_credentials github_client_id --string-value <stub>
databricks secrets put-secret dev_matthew_giglia_hi_genie_credentials github_client_secret --string-value <stub>
```

For staging, create and populate `hi_genie_staging_credentials` the same way before the first staging deployment.
