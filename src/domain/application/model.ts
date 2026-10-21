export const APPLICATION_STATUSES = ['applied', 'in_progress', 'offer', 'rejected'] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Postulado',
  in_progress: 'En proceso',
  offer: 'Oferta',
  rejected: 'Rechazado',
}

export interface JobApplication {
  id: string
  position: string
  company?: string
  applicationDate: string
  status: ApplicationStatus
  note?: string
  createdAt: string
}
