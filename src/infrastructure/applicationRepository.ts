import { failure, EXIT_CODE, success, type CommandResult } from '../domain/application/result'
import { isApplicationStatus } from '../domain/application/validation'
import type { JobApplication } from '../domain/application/model'

export const STORAGE_KEY = 'job-tracker.applications.v1'

const STORAGE_VERSION = 1

export interface StorageAdapter {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface ApplicationRepository {
  load(): CommandResult<JobApplication[]>
  save(applications: readonly JobApplication[]): CommandResult<void>
}

interface StoredApplications {
  version: number
  applications: JobApplication[]
}

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === 'string'

const isJobApplication = (value: unknown): value is JobApplication => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const application = value as Record<string, unknown>

  return (
    typeof application.id === 'string' &&
    typeof application.position === 'string' &&
    isOptionalString(application.company) &&
    typeof application.applicationDate === 'string' &&
    typeof application.status === 'string' &&
    isApplicationStatus(application.status) &&
    isOptionalString(application.note) &&
    typeof application.createdAt === 'string'
  )
}

const isStoredApplications = (value: unknown): value is StoredApplications => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const storedApplications = value as Record<string, unknown>

  return (
    storedApplications.version === STORAGE_VERSION &&
    Array.isArray(storedApplications.applications) &&
    storedApplications.applications.every(isJobApplication)
  )
}

export const createApplicationRepository = (storage: StorageAdapter): ApplicationRepository => ({
  load: () => {
    let rawValue: string | null

    try {
      rawValue = storage.getItem(STORAGE_KEY)
    } catch {
      return failure(EXIT_CODE.STORAGE_READ_ERROR, 'No se pudieron leer las postulaciones guardadas.')
    }

    if (rawValue === null) {
      return success([])
    }

    try {
      const storedValue: unknown = JSON.parse(rawValue)

      if (!isStoredApplications(storedValue)) {
        return failure(EXIT_CODE.INVALID_STORED_DATA, 'Los datos guardados no son válidos.')
      }

      return success(storedValue.applications)
    } catch {
      return failure(EXIT_CODE.INVALID_STORED_DATA, 'Los datos guardados no son válidos.')
    }
  },
  save: (applications) => {
    const storedApplications: StoredApplications = {
      version: STORAGE_VERSION,
      applications: [...applications],
    }

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(storedApplications))
      return success(undefined)
    } catch {
      return failure(EXIT_CODE.STORAGE_WRITE_ERROR, 'No se pudieron guardar las postulaciones.')
    }
  },
})
