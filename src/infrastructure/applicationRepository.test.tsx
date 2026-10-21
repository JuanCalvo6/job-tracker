import { describe, expect, it } from 'vitest'
import type { JobApplication } from '../domain/application/model'
import { createApplicationRepository, STORAGE_KEY, type StorageAdapter } from './applicationRepository'

const application: JobApplication = {
  id: 'application-1',
  position: 'Desarrollador Frontend',
  company: 'Acme',
  applicationDate: '2026-10-16',
  status: 'applied',
  createdAt: '2026-10-16T12:00:00.000Z',
}

class MemoryStorage implements StorageAdapter {
  readonly values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

describe('application repository', () => {
  it('returns an empty collection when local storage has no data', () => {
    const repository = createApplicationRepository(new MemoryStorage())

    expect(repository.load()).toEqual({ exitCode: 0, value: [] })
  })

  it('saves a versioned collection and loads it again', () => {
    const storage = new MemoryStorage()
    const repository = createApplicationRepository(storage)

    expect(repository.save([application])).toEqual({ exitCode: 0, value: undefined })
    expect(JSON.parse(storage.getItem(STORAGE_KEY) ?? '')).toEqual({
      version: 1,
      applications: [application],
    })
    expect(repository.load()).toEqual({ exitCode: 0, value: [application] })
  })

  it('reports invalid stored data without overwriting it', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, '{invalid json')
    const repository = createApplicationRepository(storage)

    expect(repository.load().exitCode).toBe(6)
    expect(storage.getItem(STORAGE_KEY)).toBe('{invalid json')
  })

  it('reports read and write failures', () => {
    const readFailure: StorageAdapter = {
      getItem: () => {
        throw new Error('read failed')
      },
      setItem: () => undefined,
    }
    const writeFailure: StorageAdapter = {
      getItem: () => null,
      setItem: () => {
        throw new Error('write failed')
      },
    }

    expect(createApplicationRepository(readFailure).load().exitCode).toBe(4)
    expect(createApplicationRepository(writeFailure).save([application]).exitCode).toBe(5)
  })
})
