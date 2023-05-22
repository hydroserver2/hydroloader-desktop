export interface FileAccess {
  path: string,
  header_label_row?: number,
  data_starts_on?: number,
  delimiter?: string,
  quote_char?: string,
  escape_char?: string,
  newline_char?: string
}

export interface FileTimestamp {
  column: number | string,
  format?: string,
  timezone?: string
}

export interface DataStream {
  column: string | number,
  datastream_id: string
}


export interface FileStreamConfig {
  crontab: string,
  start_time: string,
  end_time?: string,
  file_access: FileAccess,
  file_timestamp: FileTimestamp,
  data_streams: DataStream[]
}
