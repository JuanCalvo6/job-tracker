import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, type ApplicationStatus } from '../domain/application/model'
import type {
  ApplicationSelection,
  ApplicationSortDirection,
  ApplicationSortField,
} from '../domain/application/selectors'

interface ApplicationControlsProps {
  selection: ApplicationSelection
  onSelectionChange: (selection: Partial<ApplicationSelection>) => void
  onReset: () => void
}

function ApplicationControls({ selection, onSelectionChange, onReset }: ApplicationControlsProps) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700" htmlFor="sort-field">
        Ordenar por
        <div className="relative">
          <select
            id="sort-field"
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm font-normal text-slate-950 outline-none focus:border-sky-600 focus:ring-3 focus:ring-sky-100"
            value={selection.sortField}
            onChange={(event) =>
              onSelectionChange({ sortField: event.target.value as ApplicationSortField })
            }
          >
            <option value="applicationDate">Fecha</option>
            <option value="position">Puesto</option>
            <option value="company">Empresa</option>
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-2/3 rotate-45 border-b-2 border-r-2 border-slate-500"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700" htmlFor="sort-direction">
        Dirección
        <div className="relative">
          <select
            id="sort-direction"
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm font-normal text-slate-950 outline-none focus:border-sky-600 focus:ring-3 focus:ring-sky-100"
            value={selection.sortDirection}
            onChange={(event) =>
              onSelectionChange({ sortDirection: event.target.value as ApplicationSortDirection })
            }
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-2/3 rotate-45 border-b-2 border-r-2 border-slate-500"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700" htmlFor="status-filter">
        Filtrar por estado
        <div className="relative">
          <select
            id="status-filter"
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm font-normal text-slate-950 outline-none focus:border-sky-600 focus:ring-3 focus:ring-sky-100"
            value={selection.status}
            onChange={(event) =>
              onSelectionChange({ status: event.target.value as ApplicationStatus | 'all' })
            }
          >
            <option value="all">Todos los estados</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-2/3 rotate-45 border-b-2 border-r-2 border-slate-500"
          />
        </div>
      </label>

      <div className="flex items-end">
        <button
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-3 focus:ring-sky-100"
          type="button"
          onClick={onReset}
        >
          Restablecer vista
        </button>
      </div>
    </div>
  )
}

export default ApplicationControls
