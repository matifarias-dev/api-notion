export enum OrderStatus {
  confirmed = 'confirmed',
  payment_req = 'payment_required',
  payment_prog = 'payment_in_progress',
  partially = 'partially_paid',
  paid = 'paid',
  cancelled = 'cancelled',
  invalid = 'invalid'
}
