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

export interface NotificationBody {
  _id: string
  resource: string
  user_id: number
  topic: string
  application_id: number
  attempts: number
  sent: string
  received: string
}

export interface MeliOrderFilter {
  item: string | null
  tags: string | null
  'order.status': string | null
  'order.date_created.from': string | null
  'order.date_created.to': string | null
  sort: string | null
  limit: string | null
}

interface Item {
  id: string
  title: string
  category_id: string
  variation_id: number
  seller_custom_field: any
  variation_attributes: VariationAttribute[]
  warranty: string
  condition: string
  seller_sku: string
  global_price: any
  net_weight: any
  user_product_id: string
}

interface VariationAttribute {
  name: string
  id: string
  value_id: string
  value_name: string
}

interface RequestedQuantity {
  value: number
  measure: string
}

interface Payment {
  id: number
  order_id: number
  payer_id: number
  collector: {
    id: number
  }
  card_id: number
  reason: string
  site_id: string
  payment_method_id: string
  currency_id: string
  installments: number
  issuer_id: string
  atm_transfer_reference: {
    transaction_id: any
    company_id: any
  }
  coupon_id: any
  activation_uri: any
  operation_type: string
  payment_type: string
  available_actions: string[]
  status: string
  status_code: any
  status_detail: string
  transaction_amount: number
  transaction_amount_refunded: number
  taxes_amount: number
  shipping_cost: number
  coupon_amount: number
  overpaid_amount: number
  total_paid_amount: number
  installment_amount: number
  deferred_period: any
  date_approved: string
  transaction_order_id: any
  date_created: string
  date_last_modified: string
  marketplace_fee: number
  reference_id: any
  authorization_code: string
}

interface Shipping {
  id: number
}

interface Seller {
  id: number
  user_type: any
  tags: any[]
  internal_tags: any[]
}

interface Buyer {
  id: number
  nickname: string
  first_name: string
  last_name: string
  user_type: any
  tags: any[]
  internal_tags: any[]
}

interface Taxes {
  amount: any
  currency_id: any
  id: any
}

interface OrderRequest {
  change: any
  return: any
}

interface Feedback {
  seller: any
  buyer: any
}

interface Context {
  channel: string
  site: string
  flows: any[]
  application: any
  product_id: any
  store_id: any
}

interface Coupon {
  amount: number
  id: any
}

export interface OrderDetails {
  id: number
  date_created: string
  last_updated: string
  expiration_date: string
  date_closed: string
  comment: any
  pack_id: any
  pickup_id: any
  fulfilled: any
  hidden_for_seller: any
  buying_mode: string
  shipping_cost: any
  application_id: any
  mediations: any[]
  total_amount: number
  paid_amount: number
  coupon: Coupon
  order_items: OrderItem[]
  currency_id: string
  payments: Payment[]
  shipping: Shipping
  status: string
  status_detail: any
  tags: string[]
  internal_tags: string[]
  feedback: Feedback
  context: Context
  seller: Seller
  buyer: Buyer
  taxes: Taxes
  cancel_detail: any
  manufacturing_ending_date: any
  order_request: OrderRequest
}

interface OrderItem {
  item: Item
  quantity: number
  requested_quantity: RequestedQuantity
  picked_quantity: any
  unit_price: number
  full_unit_price: number
  currency_id: string
  manufacturing_days: any
  sale_fee: number
  listing_type_id: string
  base_exchange_rate: any
  base_currency_id: any
  element_id: any
  discounts: any
  bundle: any
  compat_id: any
}

export interface MeliNotionItem {
  title: string
  img: string // pictures[0].secure_url
  quantity: string
  productId: string
  sku: string // seller_sku
}

export interface MeliNotionTable {
  orderId: number
  created: string
  clientName: string // buyer.first_name + buyer.last_name
  clientUser: string // buyer.nickname
  reciverName: string
  tags: string[]
  logisticType: string
  packItems: MeliNotionItem[]
}

interface SaleTerm {
  id: string
  name: string
  value_id: string
  value_name: string
  value_struct: any
  values: Array<{
    id: string
    name: string
    struct: any
  }>
  value_type: string
}

interface Picture {
  id: string
  url: string
  secure_url: string
  size: string
  max_size: string
  quality: string
}

interface SellerAddress {
  comment: string
  address_line: string
  zip_code: string
  city: {
    id: string
    name: string
  }
  state: {
    id: string
    name: string
  }
  country: {
    id: string
    name: string
  }
  search_location: {
    city: {
      id: string
      name: string
    }
    state: {
      id: string
      name: string
    }
  }
  latitude: number
  longitude: number
  id: number
}

interface Attribute {
  id: string
  name: string
  value_id: string
  value_name: string
  values: Array<{
    id: string
    name: string
    struct: any
  }>
  value_type: string
}

interface AttributeCombination {
  id: string
  name: string
  value_id: string
  value_name: string
  values: Array<{
    id: string
    name: string
    struct: any
  }>
  value_type: string
}

interface Variation {
  id: number
  price: number
  attribute_combinations: AttributeCombination[]
  available_quantity: number
  sold_quantity: number
  sale_terms: SaleTerm[]
  picture_ids: string[]
  seller_custom_field: any
  catalog_product_id: any
  inventory_id: string
  item_relations: any[]
  user_product_id: string
}

interface Shipping {
  mode: string
  methods: any[]
  tags: string[]
  dimensions: string
  local_pick_up: boolean
  free_shipping: boolean
  logistic_type: string
  store_pick_up: boolean
}

interface Geolocation {
  latitude: number
  longitude: number
}

export interface ItemDetailResponse {
  id: string
  site_id: string
  title: string
  seller_id: number
  category_id: string
  user_product_id: string
  official_store_id: string
  price: number
  base_price: number
  original_price: any
  inventory_id: any
  currency_id: string
  initial_quantity: number
  available_quantity: number
  sold_quantity: number
  sale_terms: SaleTerm[]
  buying_mode: string
  listing_type_id: string
  start_time: string
  stop_time: string
  end_time: string
  expiration_time: string
  condition: string
  permalink: string
  thumbnail_id: string
  thumbnail: string
  pictures: Picture[]
  video_id: any
  descriptions: any[]
  accepts_mercadopago: boolean
  non_mercado_pago_payment_methods: any[]
  shipping: Shipping
  international_delivery_mode: string
  seller_address: SellerAddress
  seller_contact: any
  location: any
  geolocation: Geolocation
  coverage_areas: any[]
  attributes: Attribute[]
  warnings: any[]
  listing_source: string
  variations: Variation[]
  status: string
  sub_status: any[]
  tags: string[]
  warranty: string
  catalog_product_id: any
  domain_id: string
  seller_custom_field: any
  parent_item_id: any
  differential_pricing: any
  deal_ids: string[]
  automatic_relist: boolean
  date_created: string
  last_updated: string
  health: number
  catalog_listing: boolean
  item_relations: any[]
  channels: string[]
}
