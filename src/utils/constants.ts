export const TOKEN_BEARER = 'bearer'

export const GRANT_TYPE = {
  authorization: 'authorization_code',
  refresh: 'refresh_token'
}

export const LOGISTIC_TYPE = [
  { value: 'self_service', label: 'FLEX' },
  { value: 'xd_drop_off', label: 'MERCADO ENVIOS' },
  { value: 'fulfillment', label: 'FULL' },
  { value: 'cross_docking', label: 'COLECTA' }
]

export const TIME_THRESHOLD = 1800 // seconds

export const CUTOFF_T = 14 // hs
