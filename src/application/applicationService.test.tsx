import { describe, expect, it } from 'vitest'
import { createApplicationService } from './applicationService'
import { createApplicationRepository, type StorageAdapter } from '../infrastructure/applicationRepository'

class MemoryStorage implements StorageAdapter {
  readonly values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

const createService = (storage: StorageAdapter = new MemoryStorage()) =>
  createApplicationService(createApplicationRepository(storage), {
    createId: () => 'application-1',
    now: () => '2026-10-16T12:00:00.000Z',
  })

const validInput = {
  position: '  Desarrollador Frontend ',
  company: ' Acme ',
  applicationDate: '2026-10-16',
  status: 'applied',
  note: '  Enviar portafolio ',
}

describe('application service commands', () => {
  it('creates a normalized application only after it is persisted', () => {
    const service = createService()

    const result = service.createApplication(validInput, '2026-10-16')

    expect(result).toEqual({
      exitCode: 0,
      value: {
        id: 'application-1',
        position: 'Desarrollador Frontend',
        company: 'Acme',
        applicationDate: '2026-10-16',
        status: 'applied',
        note: 'Enviar portafolio',
        createdAt: '2026-10-16T12:00:00.000Z',
      },
    })
    expect(service.getApplications()).toHaveLength(1)
  })

  it('returns validation and duplicate exit codes without changing data', () => {
    const service = createService()

    expect(
      service.createApplication({ ...validInput, position: ' ' }, '2026-10-16').exitCode,
    ).toBe(1)
    expect(service.createApplication(validInput, '2026-10-16').exitCode).toBe(0)
    expect(service.createApplication(validInput, '2026-10-16').exitCode).toBe(2)
    expect(service.getApplications()).toHaveLength(1)
  })

  it('updates and changes status for an existing application', () => {
    const service = createService()
    service.createApplication(validInput, '2026-10-16')

    expect(
      service.updateApplication(
        'application-1',
        { ...validInput, position: 'Desarrollador Full Stack' },
        '2026-10-16',
      ).exitCode,
    ).toBe(0)
    expect(service.changeApplicationStatus('application-1', 'offer').exitCode).toBe(0)
    expect(service.getApplications()[0]).toMatchObject({
      position: 'Desarrollador Full Stack',
      status: 'offer',
    })
  })

  it('returns not found for unknown update, status, and delete commands', () => {
    const service = createService()

    expect(service.updateApplication('missing', validInput, '2026-10-16').exitCode).toBe(3)
    expect(service.changeApplicationStatus('missing', 'offer').exitCode).toBe(3)
    expect(service.deleteApplication('missing').exitCode).toBe(3)
  })

  it('does not update in-memory data when persistence fails', () => {
    const writeFailure: StorageAdapter = {
      getItem: () => null,
      setItem: () => {
        throw new Error('write failed')
      },
    }
    const service = createService(writeFailure)

    expect(service.createApplication(validInput, '2026-10-16').exitCode).toBe(5)
    expect(service.getApplications()).toEqual([])
  })
})
