import { type errorTypes, type grantTypes } from '../types/meli.types'

export interface MeliTokenResponse {
  access_token: string
  token_type: grantTypes
  expires_in: number
  scope: string
  user_id: number
  refresh_token: string
}

export interface InvalidGrant {
  error_description: string
  error: errorTypes
  status: number
  cause: []
}

export interface MeliPayment {
  reason: string
  status_code: number | null
  total_paid_amount: number
  operation_type: string
  transaction_amount: number
  transaction_amount_refunded: number
  date_approved: string
  collector: {
    id: number
  }
  coupon_id: number | null
  installments: number
  authorization_code: string | null
  taxes_amount: number
  id: number
  date_last_modified: string
  coupon_amount: number
  available_actions: string[]
  shipping_cost: number
  installment_amount: number | null
  date_created: string
  activation_uri: string | null
  overpaid_amount: number
  card_id: string | null
  status_detail: string
  issuer_id: string
  payment_method_id: string
  payment_type: string
  deferred_period: string | null
  atm_transfer_reference: {
    transaction_id: string | null
    company_id: string | null
  }
  site_id: string
  payer_id: number
  order_id: number
  currency_id: string
  status: string
  transaction_order_id: string | null
}

export interface MeliOrderItem {
  item: {
    id: string
    title: string
    category_id: string
    variation_id: string | null
    seller_custom_field: string | null
    global_price: number | null
    net_weight: number | null
    variation_attributes: any[]
    warranty: string
    condition: string
    seller_sku: string
  }
  quantity: number
  unit_price: number
  full_unit_price: number
  currency_id: string
  manufacturing_days: number | null
  picked_quantity: number | null
  requested_quantity: {
    measure: string
    value: number
  }
  sale_fee: number
  listing_type_id: string
  base_exchange_rate: number | null
  base_currency_id: string | null
  bundle: any
  element_id: number
}

export interface MeliResults {
  payments: MeliPayment[]
  fulfilled: any
  taxes: {
    amount: number | null
    currency_id: string | null
    id: string | null
  }
  order_request: {
    change: any
    return: any
  }
  expiration_date: string
  feedback: {
    buyer: any
    seller: any
  }
  shipping: {
    id: number
  }
  date_closed: string
  id: number
  manufacturing_ending_date: string | null
  order_items: MeliOrderItem[]
  date_last_updated: string
  last_updated: string
  comment: string | null
  pack_id: number
  coupon: {
    amount: number
    id: number | null
  }
  shipping_cost: number | null
  date_created: string
  pickup_id: string | null
  status_detail: string | null
  tags: string[]
  buyer: {
    id: number
    nickname: string
  }
  seller: {
    id: number
    nickname: string
  }
  total_amount: number
  paid_amount: number
  currency_id: string
  status: string
  context: {
    application: string | null
    product_id: string | null
    channel: string
    site: string
    flows: any[]
  }
}

export interface MeliOrderResponse {
  query: string
  results: MeliResults[]
  sort: {
    id: string
    name: string
  }
  available_sorts: Array<{
    id: string
    name: string
  }>
  filters: any[]
  paging: {
    total: number
    offset: number
    limit: number
  }
  display: string
}

export interface SubstatusHistory {
  date: string
  substatus: string
  status: string
}

export interface StatusHistory {
  date_shipped: string | null
  date_returned: string | null
  date_delivered: string | null
  date_first_visit: string | null
  date_not_delivered: string | null
  date_cancelled: string | null
  date_handling: string
  date_ready_to_ship: string
}

export interface DimensionsSource {
  origin: string
  id: string
}

export interface ShippingItem {
  quantity: number
  dimensions_source: DimensionsSource
  description: string
  id: string
  user_product_id: any
  sender_id: number
  dimensions: string
}

export interface ShippingOption {
  processing_time: any
  cost: number
  estimated_schedule_limit: {
    date: any
  }
  shipping_method_id: number
  estimated_delivery_final: {
    date: string
    offset: number
  }
  buffering: {
    date: any
  }
  pickup_promise: any
  list_cost: number
  estimated_delivery_limit: {
    date: string
    offset: number
  }
  priority_class: any
  delivery_promise: string
  delivery_type: string
  estimated_handling_limit: {
    date: string
  }
  estimated_delivery_time: {
    date: string
    pay_before: string
    schedule: any
    unit: string
    offset: {
      date: any
      shipping: any
    }
    shipping: number
    time_frame: {
      from: any
      to: any
    }
    handling: number
    type: string
  }
  name: string
  id: number
  estimated_delivery_extended: {
    date: string
    offset: number
  }
  currency_id: string
}

export interface Country {
  id: string
  name: string
}

export interface City {
  id: string | null
  name: string | null
}

export interface State {
  id: string
  name: string
}

export interface SenderAddress {
  country: Country
  address_line: string
  types: string[]
  scoring: any
  agency: any
  city: City
  geolocation_type: string
  latitude: number
  municipality: {
    id: any
    name: any
  }
  location_id: any
  street_name: string
  zip_code: string
  geolocation_source: any
  intersection: any
  street_number: string
  comment: string
  id: any
  state: State
  neighborhood: {
    id: any
    name: any
  }
  geolocation_last_updated: any
  longitude: number
}

export interface ReceiverAddress {
  country: Country
  address_line: string
  types: string[]
  scoring: any
  agency: any
  city: {
    id: string | null
    name: string
  }
  geolocation_type: string
  latitude: number
  municipality: {
    id: any
    name: any
  }
  location_id: any
  street_name: string
  zip_code: string
  geolocation_source: string
  delivery_preference: string
  intersection: any
  street_number: string
  receiver_name: string
  comment: string
  id: number
  state: State
  neighborhood: {
    id: any
    name: any
  }
  geolocation_last_updated: string
  receiver_phone: string
  longitude: number
}

export interface Sibling {
  reason: any
  sibling_id: any
  description: any
  source: any
  date_created: any
  last_updated: any
}

export interface CostComponents {
  loyal_discount: number
  special_discount: number
  compensation: number
  gap_discount: number
  ratio: number
}

export interface ShippingResponse {
  substatus_history: SubstatusHistory[]
  snapshot_packing: any
  receiver_id: number
  base_cost: number
  status_history: StatusHistory
  type: string
  return_details: any
  sender_id: number
  mode: string
  order_cost: number
  priority_class: any
  service_id: number
  shipping_items: ShippingItem[]
  tracking_number: string
  cost_components: CostComponents
  id: number
  tracking_method: string
  last_updated: string
  items_types: any
  comments: any
  substatus: string
  date_created: string
  date_first_printed: string
  created_by: string
  application_id: any
  shipping_option: ShippingOption
  tags: any[]
  sender_address: SenderAddress
  sibling: Sibling
  return_tracking_number: any
  site_id: string
  carrier_info: any
  market_place: string
  receiver_address: ReceiverAddress
  customer_id: any
  order_id: number
  quotation: any
  status: string
  logistic_type: string
}
