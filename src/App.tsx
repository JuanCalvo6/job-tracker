import { useState } from 'react'
import { createApplicationService, type ApplicationService } from './application/applicationService'
import ApplicationControls from './components/ApplicationControls'
import EmptyApplicationState from './components/EmptyApplicationState'
import ApplicationForm from './components/ApplicationForm'
import ApplicationList from './components/ApplicationList'
import { selectApplications, type ApplicationSelection } from './domain/application/selectors'
import type { ApplicationStatus, JobApplication } from './domain/application/model'
import { EXIT_CODE, type CommandResult } from './domain/application/result'
import type { ApplicationInput } from './domain/application/validation'
import { createApplicationRepository } from './infrastructure/applicationRepository'

const getCurrentLocalDate = (): string => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

const DEFAULT_SELECTION: ApplicationSelection = {
  status: 'all',
  sortField: 'applicationDate',
  sortDirection: 'desc',
}

function App() {
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)
  const [applicationService] = useState<ApplicationService>(() =>
    createApplicationService(createApplicationRepository(window.localStorage)),
  )
  const [initialLoadResult] = useState(() => applicationService.loadApplications())
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    return initialLoadResult.exitCode === EXIT_CODE.SUCCESS ? initialLoadResult.value : []
  })
  const [persistenceError, setPersistenceError] = useState<string | undefined>(() =>
    initialLoadResult.exitCode === EXIT_CODE.SUCCESS ? undefined : initialLoadResult.message,
  )
  const [selection, setSelection] = useState<ApplicationSelection>(DEFAULT_SELECTION)
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null)

  const updatePersistenceError = (result: CommandResult<unknown>) => {
    if (result.exitCode === EXIT_CODE.SUCCESS) {
      setPersistenceError(undefined)
      return
    }

    if (
      result.exitCode === EXIT_CODE.STORAGE_READ_ERROR ||
      result.exitCode === EXIT_CODE.STORAGE_WRITE_ERROR ||
      result.exitCode === EXIT_CODE.INVALID_STORED_DATA
    ) {
      setPersistenceError(result.message)
    }
  }

  const handleCreateApplication = (input: ApplicationInput) => {
    const result = applicationService.createApplication(input, getCurrentLocalDate())

    if (result.exitCode === EXIT_CODE.SUCCESS) {
      setApplications([...applicationService.getApplications()])
    }

    updatePersistenceError(result)

    return result
  }

  const handleUpdateApplication = (id: string, input: ApplicationInput) => {
    const result = applicationService.updateApplication(id, input, getCurrentLocalDate())

    if (result.exitCode === EXIT_CODE.SUCCESS) {
      setApplications([...applicationService.getApplications()])
    }

    updatePersistenceError(result)

    return result
  }

  const handleChangeApplicationStatus = (id: string, status: ApplicationStatus) => {
    const result = applicationService.changeApplicationStatus(id, status)

    if (result.exitCode === EXIT_CODE.SUCCESS) {
      setApplications([...applicationService.getApplications()])
    }

    updatePersistenceError(result)
  }

  const handleDeleteApplication = (application: JobApplication) => {
    const isConfirmed = window.confirm(
      `¿Querés eliminar la postulación de ${application.position}? Esta acción no se puede deshacer.`,
    )

    if (!isConfirmed) {
      return
    }

    const result = applicationService.deleteApplication(application.id)

    if (result.exitCode === EXIT_CODE.SUCCESS) {
      setApplications([...applicationService.getApplications()])
    }

    updatePersistenceError(result)
  }

  const visibleApplications = selectApplications(applications, selection)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-sm sm:px-8">
          <p className="text-sm font-medium tracking-wide text-sky-300">SEGUIMIENTO PERSONAL</p>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Job Tracker</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Organizá tus oportunidades laborales desde un espacio claro y enfocado.
              </p>
            </div>
            <button
              className="w-fit rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-3 focus:ring-sky-200"
              onClick={() => setIsApplicationDialogOpen(true)}
              type="button"
            >
              Nueva postulación
            </button>
          </div>
        </header>

        {persistenceError && (
          <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {persistenceError}
          </p>
        )}

        <section
          aria-labelledby="results-heading"
          className="min-h-80 rounded-3xl border border-dashed border-slate-300 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-medium text-sky-700">SEGUIMIENTO</p>
          <ApplicationControls
            selection={selection}
            onSelectionChange={(nextSelection) =>
              setSelection((currentSelection) => ({ ...currentSelection, ...nextSelection }))
            }
            onReset={() => setSelection(DEFAULT_SELECTION)}
          />
          <h2 id="results-heading" className="mt-6 text-xl font-semibold tracking-tight">
            Resultados
          </h2>
          {visibleApplications.length > 0 ? (
            <ApplicationList
              applications={visibleApplications}
              onDelete={handleDeleteApplication}
              onEdit={setEditingApplication}
              onStatusChange={handleChangeApplicationStatus}
            />
          ) : applications.length === 0 ? (
            <EmptyApplicationState
              actionLabel="Crear postulación"
              message="Todavía no registraste postulaciones."
              onAction={() => setIsApplicationDialogOpen(true)}
            />
          ) : (
            <EmptyApplicationState
              actionLabel="Limpiar filtro"
              message="No hay postulaciones con el estado seleccionado."
              onAction={() => setSelection(DEFAULT_SELECTION)}
            />
          )}
        </section>
      </div>

      {isApplicationDialogOpen && (
        <div
          aria-labelledby="new-application-heading"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-4 sm:items-center sm:justify-center sm:p-6"
          role="dialog"
        >
          <section className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-sky-700">PRIMER PASO</p>
                <h2 id="new-application-heading" className="mt-2 text-xl font-semibold tracking-tight">
                  Nueva postulación
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Registrá los datos esenciales de cada oportunidad para mantener tu búsqueda ordenada.
                </p>
              </div>
              <button
                aria-label="Cerrar formulario"
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-3 focus:ring-sky-100"
                onClick={() => setIsApplicationDialogOpen(false)}
                type="button"
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>
            <ApplicationForm
              onSubmit={handleCreateApplication}
              onSuccess={() => setIsApplicationDialogOpen(false)}
            />
          </section>
        </div>
      )}

      {editingApplication && (
        <div
          aria-labelledby="edit-application-heading"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-4 sm:items-center sm:justify-center sm:p-6"
          role="dialog"
        >
          <section className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-sky-700">ACTUALIZAR</p>
                <h2 id="edit-application-heading" className="mt-2 text-xl font-semibold tracking-tight">
                  Editar postulación
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Actualizá los datos para mantener el seguimiento al día.
                </p>
              </div>
              <button
                aria-label="Cerrar edición"
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-3 focus:ring-sky-100"
                onClick={() => setEditingApplication(null)}
                type="button"
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>
            <ApplicationForm
              formLabel="Editar postulación"
              initialValues={editingApplication}
              onSubmit={(input) => handleUpdateApplication(editingApplication.id, input)}
              onSuccess={() => setEditingApplication(null)}
              submitLabel="Guardar cambios"
            />
          </section>
        </div>
      )}
    </main>
  )
}

export default App
