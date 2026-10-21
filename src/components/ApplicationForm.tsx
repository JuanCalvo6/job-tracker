import { useState } from 'react'
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from '../domain/application/model'
import { EXIT_CODE, type CommandResult } from '../domain/application/result'
import {
  validateApplicationInput,
  type ApplicationField,
  type ApplicationInput,
  type ApplicationValidationErrors,
} from '../domain/application/validation'

interface FormValues {
  position: string
  company: string
  applicationDate: string
  status: string
  note: string
}

interface ApplicationFormProps {
  formLabel?: string
  initialValues?: ApplicationInput
  onSuccess?: () => void
  onSubmit?: (input: ApplicationInput) => CommandResult<unknown>
  submitLabel?: string
  today?: string
}

const initialFormValues: FormValues = {
  position: '',
  company: '',
  applicationDate: '',
  status: 'applied',
  note: '',
}

const getCurrentLocalDate = (): string => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

const toFormValues = (input: ApplicationInput | undefined): FormValues => ({
  position: input?.position ?? initialFormValues.position,
  company: input?.company ?? initialFormValues.company,
  applicationDate: input?.applicationDate ?? initialFormValues.applicationDate,
  status: input?.status ?? initialFormValues.status,
  note: input?.note ?? initialFormValues.note,
})

function ApplicationForm({
  formLabel = 'Nueva postulación',
  initialValues,
  onSubmit,
  onSuccess,
  submitLabel = 'Guardar postulación',
  today = getCurrentLocalDate(),
}: ApplicationFormProps) {
  const [formValues, setFormValues] = useState<FormValues>(() => toFormValues(initialValues))
  const [fieldErrors, setFieldErrors] = useState<ApplicationValidationErrors>({})
  const [submissionError, setSubmissionError] = useState<string>()

  const updateField = (field: keyof FormValues, value: string) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }))
    setSubmissionError(undefined)

    if (field in fieldErrors) {
      setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    }
  }

  const getFieldErrorProps = (field: ApplicationField) => {
    const error = fieldErrors[field]

    return error
      ? {
          'aria-describedby': `${field}-error`,
          'aria-invalid': true,
        }
      : {}
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionError(undefined)

    const validation = validateApplicationInput(formValues, today)

    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      return
    }

    setFieldErrors({})

    if (!onSubmit) {
      return
    }

    const result = onSubmit(formValues)

    if (result.exitCode === EXIT_CODE.SUCCESS) {
      onSuccess?.()
      return
    }

    if (result.exitCode === EXIT_CODE.VALIDATION_ERROR) {
      setFieldErrors(result.errors as ApplicationValidationErrors)
    }

    setSubmissionError(result.message)
  }

  return (
    <form
      aria-label={formLabel}
      className="mt-4 flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="position">
            Puesto
          </label>
          <input
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-3 focus:ring-sky-100"
            id="position"
            name="position"
            onChange={(event) => updateField('position', event.target.value)}
            placeholder="Ej. Desarrollador Frontend"
            type="text"
            value={formValues.position}
            {...getFieldErrorProps('position')}
          />
          {fieldErrors.position && (
            <span id="position-error" role="alert" className="font-normal text-rose-700">
              {fieldErrors.position}
            </span>
          )}
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800" htmlFor="company">
          Empresa (opcional)
          <input
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-3 focus:ring-sky-100"
            id="company"
            name="company"
            onChange={(event) => updateField('company', event.target.value)}
            placeholder="Ej. Acme"
            type="text"
            value={formValues.company}
          />
        </label>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="applicationDate">
            Fecha de postulación
          </label>
          <input
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-950 outline-none transition focus:border-sky-600 focus:ring-3 focus:ring-sky-100"
            id="applicationDate"
            name="applicationDate"
            onChange={(event) => updateField('applicationDate', event.target.value)}
            type="date"
            value={formValues.applicationDate}
            {...getFieldErrorProps('applicationDate')}
          />
          {fieldErrors.applicationDate && (
            <span id="applicationDate-error" role="alert" className="font-normal text-rose-700">
              {fieldErrors.applicationDate}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="status">
            Estado
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-11 text-base font-normal text-slate-950 outline-none transition focus:border-sky-600 focus:ring-3 focus:ring-sky-100"
              id="status"
              name="status"
              onChange={(event) => updateField('status', event.target.value)}
              value={formValues.status}
              {...getFieldErrorProps('status')}
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {APPLICATION_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-2.5 w-2.5 -translate-y-2/3 rotate-45 border-b-2 border-r-2 border-slate-500"
            />
          </div>
          {fieldErrors.status && (
            <span id="status-error" role="alert" className="font-normal text-rose-700">
              {fieldErrors.status}
            </span>
          )}
        </div>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-800" htmlFor="note">
        Nota (opcional)
        <textarea
          className="min-h-24 resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-3 focus:ring-sky-100"
          id="note"
          name="note"
          onChange={(event) => updateField('note', event.target.value)}
          placeholder="Agregá cualquier detalle que te ayude a recordar esta oportunidad."
          rows={4}
          value={formValues.note}
        />
      </label>

      {submissionError && (
        <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {submissionError}
        </p>
      )}

      <button
        className="w-full rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-3 focus:ring-sky-200 sm:w-fit"
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  )
}

export default ApplicationForm
