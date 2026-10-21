export const EXIT_CODE = {
  SUCCESS: 0,
  VALIDATION_ERROR: 1,
  DUPLICATE_APPLICATION: 2,
  NOT_FOUND: 3,
  STORAGE_READ_ERROR: 4,
  STORAGE_WRITE_ERROR: 5,
  INVALID_STORED_DATA: 6,
} as const

export interface CommandSuccess<T> {
  exitCode: typeof EXIT_CODE.SUCCESS
  value: T
}

export interface CommandFailure {
  exitCode: Exclude<(typeof EXIT_CODE)[keyof typeof EXIT_CODE], typeof EXIT_CODE.SUCCESS>
  message: string
  errors?: Record<string, string | undefined>
}

export type CommandResult<T> = CommandSuccess<T> | CommandFailure

export const success = <T>(value: T): CommandSuccess<T> => ({
  exitCode: EXIT_CODE.SUCCESS,
  value,
})

export const failure = (
  exitCode: CommandFailure['exitCode'],
  message: string,
  errors?: CommandFailure['errors'],
): CommandFailure => ({
  exitCode,
  message,
  ...(errors ? { errors } : {}),
})
