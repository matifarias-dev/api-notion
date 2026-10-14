export const TOKEN_BEARER = 'bearer'
export const BASE_URL_MELI = 'https://api.mercadolibre.com'
export const BASE_URL_NOTION = ''

export const GRANT_TYPE = {
  authorization: 'authorization_code',
  refresh: 'refresh_token'
}

export const MELI_TAGS = [
  { value: 'no_shipping', label: 'RETIRA EL CLIENTE' },
  { value: 'mshop', label: 'MERCADO SHOPS' },
  { value: 'paid', label: 'PAGADO' },
  { value: 'not_delivered', label: 'NO ENTREGADO' },
  { value: 'pack_order', label: 'CARRITO' },
  { value: 'pack_order_2', label: 'CARRITO 2' }
]

export const LOGISTIC_TYPE = [
  { value: 'self_service', label: '1 FLEX' },
  { value: 'xd_drop_off', label: '2 Mercado Envio' },
  { value: 'correo_argentino', label: '3 Correo Argentino' },
  { value: 'fulfillment', label: '3 FULL' },
  { value: 'cross_docking', label: '4 COLECTA' }
]

export const CHANNELS = [
  { value: 'mshops', label: 'Mercado Shops' },
  { value: 'marketplace', label: 'Mercado Libre' }
]

export const TIME_THRESHOLD = 1800 // seconds

export const CUTOFF_T = 14 // hs
