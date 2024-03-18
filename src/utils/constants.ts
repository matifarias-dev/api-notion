export const TOKEN_BEARER = 'bearer'

export const GRANT_TYPE = {
  authorization: 'authorization_code',
  refresh: 'refresh_token'
}

export const LOGISTIC_TYPE = {
  flex: { value: 'self_service', label: 'FLEX' },
  mercadoEnvios: { value: 'xd_drop_off', label: 'MERCADO ENVIOS' },
  full: { value: 'fulfillment', label: 'FULL' },
  colecta: { value: 'cross_docking', label: 'COLECTA' }
}

export const TIME_THRESHOLD = 1800 // seconds
