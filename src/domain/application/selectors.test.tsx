import { describe, expect, it } from 'vitest'
import type { JobApplication } from './model'
import { selectApplications } from './selectors'

const applications: JobApplication[] = [
  {
    id: 'application-1',
    position: 'Diseñador UX',
    company: 'Beta',
    applicationDate: '2026-10-10',
    status: 'offer',
    createdAt: '2026-10-10T12:00:00.000Z',
  },
  {
    id: 'application-2',
    position: 'Analista de Datos',
    applicationDate: '2026-10-15',
    status: 'applied',
    createdAt: '2026-10-15T12:00:00.000Z',
  },
  {
    id: 'application-3',
    position: 'Desarrollador Frontend',
    company: 'Acme',
    applicationDate: '2026-10-15',
    status: 'in_progress',
    createdAt: '2026-10-15T13:00:00.000Z',
  },
]

describe('application selectors', () => {
  it('shows the most recent applications first by default', () => {
    expect(selectApplications(applications).map(({ id }) => id)).toEqual([
      'application-2',
      'application-3',
      'application-1',
    ])
  })

  it('filters by one status before ordering', () => {
    expect(
      selectApplications(applications, {
        status: 'in_progress',
        sortField: 'position',
        sortDirection: 'asc',
      }),
    ).toEqual([applications[2]])
  })

  it('supports ascending and descending text ordering', () => {
    expect(
      selectApplications(applications, {
        status: 'all',
        sortField: 'position',
        sortDirection: 'asc',
      }).map(({ id }) => id),
    ).toEqual(['application-2', 'application-3', 'application-1'])

    expect(
      selectApplications(applications, {
        status: 'all',
        sortField: 'position',
        sortDirection: 'desc',
      }).map(({ id }) => id),
    ).toEqual(['application-1', 'application-3', 'application-2'])
  })

  it('keeps applications without a company at the end in either direction', () => {
    expect(
      selectApplications(applications, {
        status: 'all',
        sortField: 'company',
        sortDirection: 'asc',
      }).map(({ id }) => id),
    ).toEqual(['application-3', 'application-1', 'application-2'])

    expect(
      selectApplications(applications, {
        status: 'all',
        sortField: 'company',
        sortDirection: 'desc',
      }).map(({ id }) => id),
    ).toEqual(['application-1', 'application-3', 'application-2'])
  })
})
