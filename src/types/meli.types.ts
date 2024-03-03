export type errorTypes =
  | 'invalid_client'
  | 'invalid_grant'
  | 'invalid_scope'
  | 'invalid_request'
  | 'unsupported_grant_type'
  | 'forbidden'

export type grantTypes = 'refresh_token' | 'authorization_code'
