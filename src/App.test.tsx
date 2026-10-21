import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { STORAGE_KEY } from './infrastructure/applicationRepository'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-20T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders the application title', () => {
    render(<App />)

    expect(screen.getByRole('main')).toHaveTextContent('Job Tracker')
  })

  it('renders the main workspace regions', () => {
    render(<App />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    const resultsRegion = screen.getByRole('region', { name: 'Resultados' })

    expect(resultsRegion).toHaveTextContent('SEGUIMIENTO')
    expect(screen.queryByText('VISTA GENERAL')).not.toBeInTheDocument()
    expect(resultsRegion).toContainElement(screen.getByLabelText('Ordenar por'))
    expect(resultsRegion).toContainElement(screen.getByLabelText('Filtrar por estado'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the application form from the primary action', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Nueva postulación' }))

    expect(screen.getByRole('dialog', { name: 'Nueva postulación' })).toBeInTheDocument()
    expect(screen.getByRole('form', { name: 'Nueva postulación' })).toBeInTheDocument()
  })

  it('guides people to create their first application when the list is empty', () => {
    render(<App />)

    expect(screen.getByText('Todavía no registraste postulaciones.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Crear postulación' }))

    expect(screen.getByRole('dialog', { name: 'Nueva postulación' })).toBeInTheDocument()
  })

  it('closes the dialog after saving a valid application', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Nueva postulación' }))
    fireEvent.change(screen.getByLabelText('Puesto'), { target: { value: 'Desarrollador Frontend' } })
    fireEvent.change(screen.getByLabelText('Fecha de postulación'), {
      target: { value: '2026-10-20' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar postulación' }))

    expect(screen.queryByRole('dialog', { name: 'Nueva postulación' })).not.toBeInTheDocument()
  })

  it('keeps a created application after the application is mounted again', () => {
    const { unmount } = render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Nueva postulación' }))
    fireEvent.change(screen.getByLabelText('Puesto'), { target: { value: 'Desarrollador Frontend' } })
    fireEvent.change(screen.getByLabelText('Fecha de postulación'), {
      target: { value: '2026-10-20' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar postulación' }))

    unmount()
    render(<App />)

    expect(screen.getByRole('listitem')).toHaveTextContent('Desarrollador Frontend')
  })

  it('shows a storage read error in Spanish without treating data as loaded', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read failed')
    })

    render(<App />)

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudieron leer las postulaciones guardadas.')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('shows a storage write error and keeps the form open without adding an application', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Nueva postulación' }))
    fireEvent.change(screen.getByLabelText('Puesto'), { target: { value: 'Desarrollador Frontend' } })
    fireEvent.change(screen.getByLabelText('Fecha de postulación'), {
      target: { value: '2026-10-20' },
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('write failed')
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar postulación' }))

    expect(screen.getAllByText('No se pudieron guardar las postulaciones.')).not.toHaveLength(0)
    expect(screen.getByRole('dialog', { name: 'Nueva postulación' })).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('renders persisted applications with the most recent date first', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        applications: [
          {
            id: 'application-older',
            position: 'Diseñadora UX',
            applicationDate: '2026-10-10',
            status: 'offer',
            createdAt: '2026-10-10T12:00:00.000Z',
          },
          {
            id: 'application-recent',
            position: 'Desarrollador Frontend',
            company: 'Acme',
            applicationDate: '2026-10-20',
            status: 'in_progress',
            note: 'Enviar portafolio.',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
        ],
      }),
    )

    render(<App />)

    const applications = screen.getAllByRole('listitem')

    expect(applications).toHaveLength(2)
    expect(applications[0]).toHaveTextContent('Desarrollador Frontend')
    expect(applications[0]).toHaveTextContent('Acme')
    expect(applications[0]).toHaveTextContent('20/10/2026')
    expect(applications[0]).toHaveTextContent('En proceso')
    expect(applications[0]).toHaveTextContent('Enviar portafolio.')
    expect(applications[1]).toHaveTextContent('Diseñadora UX')
    expect(applications[1]).toHaveTextContent('10/10/2026')
    expect(applications[1]).toHaveTextContent('Oferta')
  })

  it('sorts, filters, and restores the complete application list', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        applications: [
          {
            id: 'application-beta',
            position: 'Beta',
            applicationDate: '2026-10-20',
            status: 'offer',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
          {
            id: 'application-alpha',
            position: 'Alpha',
            applicationDate: '2026-10-10',
            status: 'applied',
            createdAt: '2026-10-10T12:00:00.000Z',
          },
        ],
      }),
    )

    render(<App />)

    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'position' } })
    fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'asc' } })

    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Alpha')

    fireEvent.change(screen.getByLabelText('Filtrar por estado'), { target: { value: 'offer' } })

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('listitem')).toHaveTextContent('Beta')

    fireEvent.click(screen.getByRole('button', { name: 'Restablecer vista' }))

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Beta')
  })

  it('explains an empty filtered view and clears the filter', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        applications: [
          {
            id: 'application-applied',
            position: 'Analista',
            applicationDate: '2026-10-20',
            status: 'applied',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
        ],
      }),
    )

    render(<App />)

    fireEvent.change(screen.getByLabelText('Filtrar por estado'), { target: { value: 'offer' } })

    expect(screen.getByText('No hay postulaciones con el estado seleccionado.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtro' }))

    expect(screen.getByRole('listitem')).toHaveTextContent('Analista')
  })

  it('edits an application from its current values and updates the list', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        applications: [
          {
            id: 'application-frontend',
            position: 'Desarrollador Frontend',
            company: 'Acme',
            applicationDate: '2026-10-20',
            status: 'applied',
            note: 'Enviar portafolio.',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
        ],
      }),
    )

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Editar Desarrollador Frontend' }))

    expect(screen.getByRole('dialog', { name: 'Editar postulación' })).toBeInTheDocument()
    expect(screen.getByLabelText('Puesto')).toHaveValue('Desarrollador Frontend')
    expect(screen.getByLabelText('Empresa (opcional)')).toHaveValue('Acme')
    expect(screen.getByLabelText('Nota (opcional)')).toHaveValue('Enviar portafolio.')

    fireEvent.change(screen.getByLabelText('Puesto'), { target: { value: 'Ingeniera de software' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.queryByRole('dialog', { name: 'Editar postulación' })).not.toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveTextContent('Ingeniera de software')
  })

  it('changes an application status and persists the transition', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        applications: [
          {
            id: 'application-analyst',
            position: 'Analista',
            applicationDate: '2026-10-20',
            status: 'applied',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
        ],
      }),
    )

    render(<App />)

    fireEvent.change(screen.getByLabelText('Cambiar estado de Analista'), {
      target: { value: 'rejected' },
    })

    expect(screen.getByRole('listitem')).toHaveTextContent('Rechazado')
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"status":"rejected"')
  })

  it('keeps an application when deletion is cancelled and removes it after confirmation', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        applications: [
          {
            id: 'application-analyst',
            position: 'Analista',
            applicationDate: '2026-10-20',
            status: 'applied',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
        ],
      }),
    )
    const confirmDeletion = vi.fn()
    vi.stubGlobal('confirm', confirmDeletion)

    render(<App />)

    confirmDeletion.mockReturnValueOnce(false)
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Analista' }))

    expect(screen.getByRole('listitem')).toHaveTextContent('Analista')
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"id":"application-analyst"')

    confirmDeletion.mockReturnValueOnce(true)
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Analista' }))

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"applications":[]')
  })
})
