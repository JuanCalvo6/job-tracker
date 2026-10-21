interface EmptyApplicationStateProps {
  actionLabel: string
  message: string
  onAction: () => void
}

function EmptyApplicationState({ actionLabel, message, onAction }: EmptyApplicationStateProps) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-base font-semibold text-slate-950">{message}</p>
      <button
        className="mt-4 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-3 focus:ring-sky-200"
        type="button"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </div>
  )
}

export default EmptyApplicationState
