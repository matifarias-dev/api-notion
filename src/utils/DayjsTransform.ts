import dayjs, { type Dayjs } from 'dayjs'

export const toDayjs = (value: Date): Dayjs => dayjs(value)
export const toDate = (value: Dayjs): Date => value.toDate()
