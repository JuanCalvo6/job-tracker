import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ApplicationForm from './ApplicationForm'
import { EXIT_CODE, failure, success } from '../domain/application/result'

describe('ApplicationForm', () => {
  it('renders every field required to register an application', () => {
    render(<ApplicationForm />)

    expect(screen.getByRole('form', { name: 'Nueva postulación' })).toBeInTheDocument()
    expect(screen.getByLabelText('Puesto')).toBeInTheDocument()
    expect(screen.getByLabelText('Empresa (opcional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha de postulación')).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText('Estado')).toBeInTheDocument()
    expect(screen.getByLabelText('Nota (opcional)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar postulación' })).toBeInTheDocument()
  })

  it('defaults to the applied status and keeps fields controlled', () => {
    render(<ApplicationForm />)

    const positionInput = screen.getByLabelText('Puesto')
    const statusSelect = screen.getByLabelText('Estado')
    const appliedOption = screen.getByRole('option', { name: 'Postulado' }) as HTMLOptionElement

    expect(statusSelect).toHaveValue('applied')
    expect(appliedOption.selected).toBe(true)

    fireEvent.change(positionInput, { target: { value: 'Desarrollador Frontend' } })

    expect(positionInput).toHaveValue('Desarrollador Frontend')
  })

  it('shows Spanish validation errors next to invalid fields and prevents submission', () => {
    const onSubmit = vi.fn(() => success(undefined))

    render(<ApplicationForm onSubmit={onSubmit} today="2026-10-20" />)

    fireEvent.click(screen.getByRole('button', { name: 'Guardar postulación' }))

    expect(screen.getByText('El puesto es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('La fecha es obligatoria.')).toBeInTheDocument()
    expect(screen.getByLabelText('Puesto')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Fecha de postulación')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('communicates duplicate applications in Spanish after valid input', () => {
    const onSubmit = vi.fn(() =>
      failure(EXIT_CODE.DUPLICATE_APPLICATION, 'Ya existe una postulación con esos datos.'),
    )

    render(<ApplicationForm onSubmit={onSubmit} today="2026-10-20" />)

    fireEvent.change(screen.getByLabelText('Puesto'), { target: { value: 'Desarrollador Frontend' } })
    fireEvent.change(screen.getByLabelText('Fecha de postulación'), { target: { value: '2026-10-20' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar postulación' }))

    expect(onSubmit).toHaveBeenCalledWith({
      position: 'Desarrollador Frontend',
      company: '',
      applicationDate: '2026-10-20',
      status: 'applied',
      note: '',
    })
    expect(screen.getByText('Ya existe una postulación con esos datos.')).toBeInTheDocument()
  })

  it('communicates persistence failures in Spanish without reporting success', () => {
    const onSuccess = vi.fn()
    const onSubmit = vi.fn(() => failure(EXIT_CODE.STORAGE_WRITE_ERROR, 'No se pudieron guardar las postulaciones.'))

    render(<ApplicationForm onSubmit={onSubmit} onSuccess={onSuccess} today="2026-10-20" />)

    fireEvent.change(screen.getByLabelText('Puesto'), { target: { value: 'Desarrollador Frontend' } })
    fireEvent.change(screen.getByLabelText('Fecha de postulación'), { target: { value: '2026-10-20' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar postulación' }))

    expect(screen.getByText('No se pudieron guardar las postulaciones.')).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
