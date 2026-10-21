import { describe, expect, it } from 'vitest'
import type { JobApplication } from './model'
import { isDuplicateApplication } from './duplicates'

const applications: JobApplication[] = [
  {
    id: 'application-1',
    position: 'Desarrollador Frontend',
    company: 'Acme',
    applicationDate: '2026-10-16',
    status: 'applied',
    createdAt: '2026-10-16T12:00:00.000Z',
  },
]

describe('application duplicates', () => {
  it('detects a duplicate without considering case or outer spaces', () => {
    expect(
      isDuplicateApplication(applications, {
        position: '  desarrollador frontend ',
        company: ' ACME  ',
        applicationDate: '2026-10-16',
        status: 'offer',
      }),
    ).toBe(true)
  })

  it('treats missing and blank companies as the same value', () => {
    const applicationsWithoutCompany: JobApplication[] = [
      {
        id: 'application-2',
        position: 'Analista de Datos',
        applicationDate: '2026-10-16',
        status: 'in_progress',
        createdAt: '2026-10-16T12:00:00.000Z',
      },
    ]

    expect(
      isDuplicateApplication(applicationsWithoutCompany, {
        position: 'Analista de Datos',
        company: '   ',
        applicationDate: '2026-10-16',
        status: 'applied',
      }),
    ).toBe(true)
  })

  it('allows an unchanged record when its own id is excluded', () => {
    expect(
      isDuplicateApplication(
        applications,
        {
          position: 'Desarrollador Frontend',
          company: 'Acme',
          applicationDate: '2026-10-16',
          status: 'rejected',
        },
        'application-1',
      ),
    ).toBe(false)
  })

  it('does not flag different positions, companies, or dates', () => {
    expect(
      isDuplicateApplication(applications, {
        position: 'Desarrollador Backend',
        company: 'Acme',
        applicationDate: '2026-10-16',
        status: 'applied',
      }),
    ).toBe(false)
  })
})
