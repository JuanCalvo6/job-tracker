import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  type JobApplication,
} from '../domain/application/model'

interface ApplicationListProps {
  applications: readonly JobApplication[]
  onEdit?: (application: JobApplication) => void
  onDelete?: (application: JobApplication) => void
  onStatusChange?: (id: string, status: ApplicationStatus) => void
}

const STATUS_COLOR_CLASSES: Record<ApplicationStatus, string> = {
  applied: 'bg-sky-100 text-sky-800',
  in_progress: 'bg-amber-100 text-amber-800',
  offer: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
}

const formatApplicationDate = (applicationDate: string): string => {
  const [year, month, day] = applicationDate.split('-')

  return `${day}/${month}/${year}`
}

function ApplicationList({ applications, onDelete, onEdit, onStatusChange }: ApplicationListProps) {
  return (
    <ol aria-label="Listado de postulaciones" className="mt-6 grid gap-4">
      {applications.map((application) => (
        <li
          key={application.id}
          className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="order-1 flex w-full items-center justify-between gap-3 sm:order-2 sm:w-auto sm:flex-row-reverse sm:items-center">
              <div className="relative w-fit">
                <select
                  aria-label={`Cambiar estado de ${application.position}`}
                  className={`cursor-pointer appearance-none rounded-full px-3 py-1 text-sm font-medium outline-none transition hover:ring-2 hover:ring-slate-300 focus:ring-3 focus:ring-sky-200 ${STATUS_COLOR_CLASSES[application.status]}`}
                  value={application.status}
                  onChange={(event) =>
                    onStatusChange?.(application.id, event.target.value as ApplicationStatus)
                  }
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status} className="bg-white text-center text-slate-950">
                      {APPLICATION_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label={`Editar ${application.position}`}
                  className="w-fit cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 opacity-0 pointer-events-none transition hover:bg-white focus:opacity-100 focus:outline-none focus:ring-3 focus:ring-sky-100 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 sm:self-end"
                  type="button"
                  onClick={() => onEdit?.(application)}
                >
                  Editar
                </button>
                <button
                  aria-label={`Eliminar ${application.position}`}
                  className="w-fit cursor-pointer rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 opacity-0 pointer-events-none transition hover:bg-rose-50 focus:opacity-100 focus:outline-none focus:ring-3 focus:ring-rose-100 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                  type="button"
                  onClick={() => onDelete?.(application)}
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="order-2 sm:order-1">
              <h3 className="text-base font-semibold text-slate-950">{application.position}</h3>
              {application.company && <p className="mt-1 text-sm text-slate-600">{application.company}</p>}
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Fecha de postulación:{' '}
            <time dateTime={application.applicationDate}>
              {formatApplicationDate(application.applicationDate)}
            </time>
          </p>
          {application.note && <p className="mt-3 text-sm leading-6 text-slate-700">{application.note}</p>}
        </li>
      ))}
    </ol>
  )
}

export default ApplicationList
