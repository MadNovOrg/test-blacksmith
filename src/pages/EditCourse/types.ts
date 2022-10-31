export enum RescheduleFeeType {
  APPLY_TERMS = 'APPLY_TERMS',
  CUSTOM_FEE = 'CUSTOM_FEE',
  NO_FEE = 'NO_FEE',
}

export type CourseDiff = {
  type: 'date' | 'venue'
  oldValue: string | Date[]
  newValue: string | Date[]
}
