import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ApplicationList from './ApplicationList'

describe('ApplicationList', () => {
  it('uses a representative color for every application status', () => {
    render(
      <ApplicationList
        applications={[
          {
            id: 'applied',
            position: 'Puesto 1',
            applicationDate: '2026-10-20',
            status: 'applied',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
          {
            id: 'in-progress',
            position: 'Puesto 2',
            applicationDate: '2026-10-20',
            status: 'in_progress',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
          {
            id: 'offer',
            position: 'Puesto 3',
            applicationDate: '2026-10-20',
            status: 'offer',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
          {
            id: 'rejected',
            position: 'Puesto 4',
            applicationDate: '2026-10-20',
            status: 'rejected',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
        ]}
      />,
    )

    expect(screen.getByLabelText('Cambiar estado de Puesto 1')).toHaveClass(
      'bg-sky-100',
      'text-sky-800',
    )
    expect(screen.getByLabelText('Cambiar estado de Puesto 2')).toHaveClass(
      'bg-amber-100',
      'text-amber-800',
    )
    expect(screen.getByLabelText('Cambiar estado de Puesto 3')).toHaveClass(
      'bg-emerald-100',
      'text-emerald-800',
    )
    expect(screen.getByLabelText('Cambiar estado de Puesto 4')).toHaveClass(
      'bg-rose-100',
      'text-rose-800',
    )
  })

  it('presents the current status as an interactive control and reports a new selection', () => {
    const onStatusChange = vi.fn()

    render(
      <ApplicationList
        applications={[
          {
            id: 'application-1',
            position: 'Diseñadora de producto',
            applicationDate: '2026-10-20',
            status: 'applied',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
        ]}
        onStatusChange={onStatusChange}
      />,
    )

    const statusControl = screen.getByLabelText('Cambiar estado de Diseñadora de producto')

    expect(statusControl).toHaveClass('cursor-pointer', 'hover:ring-2', 'px-3')
    expect(statusControl.parentElement?.querySelector('[aria-hidden="true"]')).toBeNull()
    expect(statusControl.compareDocumentPosition(screen.getByRole('heading', { name: 'Diseñadora de producto' }))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(statusControl.parentElement?.parentElement).toHaveClass(
      'order-1',
      'sm:order-2',
      'sm:flex-row-reverse',
    )
    expect(screen.getByRole('heading', { name: 'Diseñadora de producto' }).parentElement).toHaveClass(
      'order-2',
      'sm:order-1',
    )
    fireEvent.change(statusControl, { target: { value: 'offer' } })

    expect(onStatusChange).toHaveBeenCalledWith('application-1', 'offer')
  })

  it('keeps the edit action contextual to hovering or focusing an application', () => {
    render(
      <ApplicationList
        applications={[
          {
            id: 'application-1',
            position: 'Diseñadora de producto',
            applicationDate: '2026-10-20',
            status: 'applied',
            createdAt: '2026-10-20T12:00:00.000Z',
          },
        ]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Editar Diseñadora de producto' })).toHaveClass(
      'opacity-0',
      'group-hover:opacity-100',
      'group-focus-within:opacity-100',
      'sm:self-end',
    )
    expect(screen.getByRole('button', { name: 'Eliminar Diseñadora de producto' })).toHaveClass(
      'opacity-0',
      'group-hover:opacity-100',
      'group-focus-within:opacity-100',
    )
  })
})
