import { APPLICATION_STATUSES, type ApplicationStatus } from './model'

export interface ApplicationInput {
  position: string
  company?: string
  applicationDate: string
  status: string
  note?: string
}

export interface NormalizedApplicationInput {
  position: string
  company?: string
  applicationDate: string
  status: string
  note?: string
}

export type ApplicationField = 'position' | 'applicationDate' | 'status'

export type ApplicationValidationErrors = Partial<Record<ApplicationField, string>>

export interface ApplicationValidationResult {
  value: NormalizedApplicationInput
  errors: ApplicationValidationErrors
  isValid: boolean
}

const normalizeOptionalText = (value: string | undefined): string | undefined => {
  const normalizedValue = value?.trim()

  return normalizedValue || undefined
}

const isValidCalendarDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const isApplicationStatus = (value: string): value is ApplicationStatus =>
  APPLICATION_STATUSES.some((status) => status === value)

export const normalizeApplicationInput = (input: ApplicationInput): NormalizedApplicationInput => ({
  position: input.position.trim(),
  company: normalizeOptionalText(input.company),
  applicationDate: input.applicationDate,
  status: input.status,
  note: normalizeOptionalText(input.note),
})

export const validateApplicationInput = (
  input: ApplicationInput,
  today: string,
): ApplicationValidationResult => {
  const value = normalizeApplicationInput(input)
  const errors: ApplicationValidationErrors = {}

  if (!value.position) {
    errors.position = 'El puesto es obligatorio.'
  }
  if (!value.applicationDate) {
    errors.applicationDate = 'La fecha es obligatoria.'
  } else if (!isValidCalendarDate(value.applicationDate)) {
    errors.applicationDate = 'Ingresa una fecha válida.'
  } else if (value.applicationDate > today) {
    errors.applicationDate = 'La fecha no puede ser posterior a hoy.'
  }

  if (!isApplicationStatus(value.status)) {
    errors.status = 'Selecciona un estado válido.'
  }

  return {
    value,
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
