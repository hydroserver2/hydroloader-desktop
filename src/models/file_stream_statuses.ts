export interface FileStreamStatus {
  status: string | null,
  health: string | null,
  lastSynced: string | null,
  dataThru: string | null,
  paused: boolean
}