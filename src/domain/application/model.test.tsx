import { describe, expect, it } from 'vitest'
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type JobApplication,
} from './model'

const application: JobApplication = {
  id: 'bd92f8c0-1b7d-4dfe-b1ee-4b451792cf7c',
  position: 'Desarrollador Frontend',
  applicationDate: '2026-10-15',
  status: 'applied',
  createdAt: '2026-10-15T15:30:00.000Z',
}

describe('application model', () => {
  it('defines the four supported statuses', () => {
    expect(APPLICATION_STATUSES).toEqual(['applied', 'in_progress', 'offer', 'rejected'])
  })

  it('provides Spanish labels for every status', () => {
    expect(APPLICATION_STATUS_LABELS).toEqual({
      applied: 'Postulado',
      in_progress: 'En proceso',
      offer: 'Oferta',
      rejected: 'Rechazado',
    })
  })

  it('allows optional company and note fields', () => {
    expect(application.company).toBeUndefined()
    expect(application.note).toBeUndefined()
  })
})
