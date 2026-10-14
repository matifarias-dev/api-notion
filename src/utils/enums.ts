export enum OrderStatus {
  confirmed = 'confirmed',
  payment_req = 'payment_required',
  payment_prog = 'payment_in_progress',
  partially = 'partially_paid',
  paid = 'paid',
  cancelled = 'cancelled',
  invalid = 'invalid'
}

export enum ShippingStatus {
  ready = 'ready_to_ship',
  print = 'ready_to_print',
  not_delivered = 'not_delivered'
}

export enum NotionTableStatus {
  ventas = 'Ventas',
  preparacion = 'Preparacion',
  pegar_etiqueta = 'Pegar Etiqueta',
  listos_para_enviar = 'Listos Para Enviar'
}

// this enum must to be the same as the one in the notion table
export enum NotionTableShippingType {
  flex = '1 FLEX',
  mercado_envio = '2 Mercado Envio',
  correo_argentino = '3 Correo Argentino',
  full = '3 FULL',
  colecta = '4 COLECTA',
  particular = '1 Particular (FLEX)'
}
