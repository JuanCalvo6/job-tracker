import {
  isDuplicateApplication,
} from '../domain/application/duplicates'
import type { JobApplication } from '../domain/application/model'
import {
  failure,
  EXIT_CODE,
  success,
  type CommandResult,
} from '../domain/application/result'
import {
  isApplicationStatus,
  type ApplicationInput,
  validateApplicationInput,
} from '../domain/application/validation'
import type { ApplicationRepository } from '../infrastructure/applicationRepository'

export interface ApplicationServiceOptions {
  createId: () => string
  now: () => string
}

export interface ApplicationService {
  getApplications(): readonly JobApplication[]
  loadApplications(): CommandResult<JobApplication[]>
  createApplication(input: ApplicationInput, today: string): CommandResult<JobApplication>
  updateApplication(id: string, input: ApplicationInput, today: string): CommandResult<JobApplication>
  changeApplicationStatus(id: string, status: string): CommandResult<JobApplication>
  deleteApplication(id: string): CommandResult<void>
}

const defaultOptions: ApplicationServiceOptions = {
  createId: () => crypto.randomUUID(),
  now: () => new Date().toISOString(),
}

export const createApplicationService = (
  repository: ApplicationRepository,
  options: ApplicationServiceOptions = defaultOptions,
): ApplicationService => {
  let applications: JobApplication[] = []
  let isLoaded = false

  const loadApplications = (): CommandResult<JobApplication[]> => {
    const result = repository.load()

    if (result.exitCode === EXIT_CODE.SUCCESS) {
      applications = result.value
      isLoaded = true
    }

    return result
  }

  const ensureLoaded = (): CommandResult<JobApplication[]> =>
    isLoaded ? success(applications) : loadApplications()

  const saveApplications = (nextApplications: JobApplication[]): CommandResult<void> => {
    const result = repository.save(nextApplications)

    if (result.exitCode === EXIT_CODE.SUCCESS) {
      applications = nextApplications
    }

    return result
  }

  const createApplication = (
    input: ApplicationInput,
    today: string,
  ): CommandResult<JobApplication> => {
    const loaded = ensureLoaded()

    if (loaded.exitCode !== EXIT_CODE.SUCCESS) {
      return loaded
    }

    const validation = validateApplicationInput(input, today)

    if (!validation.isValid) {
      return failure(EXIT_CODE.VALIDATION_ERROR, 'Corrige los campos marcados.', validation.errors)
    }

    if (isDuplicateApplication(applications, validation.value)) {
      return failure(EXIT_CODE.DUPLICATE_APPLICATION, 'Ya existe una postulación con esos datos.')
    }

    if (!isApplicationStatus(validation.value.status)) {
      return failure(EXIT_CODE.VALIDATION_ERROR, 'Corrige los campos marcados.', {
        status: 'Selecciona un estado válido.',
      })
    }

    const application: JobApplication = {
      id: options.createId(),
      position: validation.value.position,
      company: validation.value.company,
      applicationDate: validation.value.applicationDate,
      status: validation.value.status,
      note: validation.value.note,
      createdAt: options.now(),
    }
    const saveResult = saveApplications([...applications, application])

    if (saveResult.exitCode !== EXIT_CODE.SUCCESS) {
      return saveResult
    }

    return success(application)
  }

  const updateApplication = (
    id: string,
    input: ApplicationInput,
    today: string,
  ): CommandResult<JobApplication> => {
    const loaded = ensureLoaded()

    if (loaded.exitCode !== EXIT_CODE.SUCCESS) {
      return loaded
    }

    const existingApplication = applications.find((application) => application.id === id)

    if (!existingApplication) {
      return failure(EXIT_CODE.NOT_FOUND, 'No se encontró la postulación.')
    }

    const validation = validateApplicationInput(input, today)

    if (!validation.isValid) {
      return failure(EXIT_CODE.VALIDATION_ERROR, 'Corrige los campos marcados.', validation.errors)
    }

    if (isDuplicateApplication(applications, validation.value, id)) {
      return failure(EXIT_CODE.DUPLICATE_APPLICATION, 'Ya existe una postulación con esos datos.')
    }

    if (!isApplicationStatus(validation.value.status)) {
      return failure(EXIT_CODE.VALIDATION_ERROR, 'Corrige los campos marcados.', {
        status: 'Selecciona un estado válido.',
      })
    }

    const updatedApplication: JobApplication = {
      id: existingApplication.id,
      position: validation.value.position,
      company: validation.value.company,
      applicationDate: validation.value.applicationDate,
      status: validation.value.status,
      note: validation.value.note,
      createdAt: existingApplication.createdAt,
    }
    const nextApplications = applications.map((application) =>
      application.id === id ? updatedApplication : application,
    )
    const saveResult = saveApplications(nextApplications)

    if (saveResult.exitCode !== EXIT_CODE.SUCCESS) {
      return saveResult
    }

    return success(updatedApplication)
  }

  const changeApplicationStatus = (
    id: string,
    status: string,
  ): CommandResult<JobApplication> => {
    const loaded = ensureLoaded()

    if (loaded.exitCode !== EXIT_CODE.SUCCESS) {
      return loaded
    }

    const existingApplication = applications.find((application) => application.id === id)

    if (!existingApplication) {
      return failure(EXIT_CODE.NOT_FOUND, 'No se encontró la postulación.')
    }

    if (!isApplicationStatus(status)) {
      return failure(EXIT_CODE.VALIDATION_ERROR, 'Corrige los campos marcados.', {
        status: 'Selecciona un estado válido.',
      })
    }

    const updatedApplication: JobApplication = { ...existingApplication, status }
    const nextApplications = applications.map((application) =>
      application.id === id ? updatedApplication : application,
    )
    const saveResult = saveApplications(nextApplications)

    if (saveResult.exitCode !== EXIT_CODE.SUCCESS) {
      return saveResult
    }

    return success(updatedApplication)
  }

  const deleteApplication = (id: string): CommandResult<void> => {
    const loaded = ensureLoaded()

    if (loaded.exitCode !== EXIT_CODE.SUCCESS) {
      return loaded
    }

    if (!applications.some((application) => application.id === id)) {
      return failure(EXIT_CODE.NOT_FOUND, 'No se encontró la postulación.')
    }

    const saveResult = saveApplications(applications.filter((application) => application.id !== id))

    if (saveResult.exitCode !== EXIT_CODE.SUCCESS) {
      return saveResult
    }

    return success(undefined)
  }

  return {
    getApplications: () => applications,
    loadApplications,
    createApplication,
    updateApplication,
    changeApplicationStatus,
    deleteApplication,
  }
}
