import { describe, expect, it } from 'vitest'
import { normalizeApplicationInput, validateApplicationInput } from './validation'

describe('application validation', () => {
  it('normalizes text fields and omits empty optional values', () => {
    expect(
      normalizeApplicationInput({
        position: '  Desarrollador Frontend  ',
        company: '   ',
        applicationDate: '2026-10-16',
        status: 'applied',
        note: '  Enviar portafolio  ',
      }),
    ).toEqual({
      position: 'Desarrollador Frontend',
      applicationDate: '2026-10-16',
      status: 'applied',
      note: 'Enviar portafolio',
    })
  })

  it('rejects a position containing only spaces', () => {
    const result = validateApplicationInput(
      {
        position: '   ',
        applicationDate: '2026-10-16',
        status: 'applied',
      },
      '2026-10-16',
    )

    expect(result.isValid).toBe(false)
    expect(result.errors.position).toBe('El puesto es obligatorio.')
  })

  it('rejects an invalid calendar date', () => {
    const result = validateApplicationInput(
      {
        position: 'Diseñador UX',
        applicationDate: '2026-02-29',
        status: 'applied',
      },
      '2026-10-16',
    )

    expect(result.isValid).toBe(false)
    expect(result.errors.applicationDate).toBe('Ingresa una fecha válida.')
  })

  it('rejects a future application date', () => {
    const result = validateApplicationInput(
      {
        position: 'Diseñador UX',
        applicationDate: '2026-10-17',
        status: 'applied',
      },
      '2026-10-16',
    )

    expect(result.isValid).toBe(false)
    expect(result.errors.applicationDate).toBe('La fecha no puede ser posterior a hoy.')
  })

  it('rejects an unsupported status', () => {
    const result = validateApplicationInput(
      {
        position: 'Diseñador UX',
        applicationDate: '2026-10-16',
        status: 'saved',
      },
      '2026-10-16',
    )

    expect(result.isValid).toBe(false)
    expect(result.errors.status).toBe('Selecciona un estado válido.')
  })
})
