import type { JobApplication } from './model'
import { normalizeApplicationInput, type ApplicationInput } from './validation'

const canonicalizeText = (value: string | undefined): string => value?.trim().toLocaleLowerCase() ?? ''

export const isDuplicateApplication = (
  applications: readonly JobApplication[],
  candidate: ApplicationInput,
  excludedId?: string,
): boolean => {
  const normalizedCandidate = normalizeApplicationInput(candidate)
  const candidatePosition = canonicalizeText(normalizedCandidate.position)
  const candidateCompany = canonicalizeText(normalizedCandidate.company)

  return applications.some((application) => {
    if (application.id === excludedId) {
      return false
    }

    return (
      canonicalizeText(application.position) === candidatePosition &&
      canonicalizeText(application.company) === candidateCompany &&
      application.applicationDate === normalizedCandidate.applicationDate
    )
  })
}
