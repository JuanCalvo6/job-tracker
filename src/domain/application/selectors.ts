import type { ApplicationStatus, JobApplication } from './model'

export type ApplicationSortField = 'applicationDate' | 'position' | 'company'
export type ApplicationSortDirection = 'asc' | 'desc'

export interface ApplicationSelection {
  status: ApplicationStatus | 'all'
  sortField: ApplicationSortField
  sortDirection: ApplicationSortDirection
}

const DEFAULT_SELECTION: ApplicationSelection = {
  status: 'all',
  sortField: 'applicationDate',
  sortDirection: 'desc',
}

const compareText = (left: string, right: string): number => left.localeCompare(right)

export const selectApplications = (
  applications: readonly JobApplication[],
  selection: Partial<ApplicationSelection> = {},
): JobApplication[] => {
  const { status, sortField, sortDirection } = { ...DEFAULT_SELECTION, ...selection }
  const filteredApplications = applications.filter(
    (application) => status === 'all' || application.status === status,
  )

  return [...filteredApplications].sort((left, right) => {
    if (sortField === 'company') {
      if (!left.company && !right.company) {
        return 0
      }

      if (!left.company) {
        return 1
      }

      if (!right.company) {
        return -1
      }
    }

    const leftValue = left[sortField] ?? ''
    const rightValue = right[sortField] ?? ''
    const comparison = compareText(leftValue, rightValue)

    return sortDirection === 'asc' ? comparison : -comparison
  })
}
