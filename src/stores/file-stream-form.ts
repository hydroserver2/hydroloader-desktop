import { defineStore, acceptHMRUpdate } from 'pinia';

type scheduleTypeValues = 'interval' | 'crontab'
type intervalUnitsValues = 'minutes' | 'hours' | 'days'
type fileAccessTypeValues = 'local_file' | 'website'

interface DataStreamForm {
  dataStreamId: string | null,
  dataStreamColumn: string | number | null
}

interface FileStreamForm {
  fileStreamName: string | null,
  fileStreamTemplate: string | null,
  scheduleType: scheduleTypeValues,
  intervalUnits: intervalUnitsValues,
  intervalValue: number | null,
  crontabValue: string | null,
  scheduleStartTime: string | null,
  fileAccessType: fileAccessTypeValues,
  localFilePath: string | null,
  website: string | null,
  headerLabelRow: number | null,
  dataStartsOn: number,
  timestampColumn: string | number | null,
  timestampFormat: string | null,
  timestampOffset: string | null,
  datastreams: DataStreamForm[],
  selectedDatastream: number | null,
  formPage: number
}

export const useFileStreamFormStore = defineStore(
  'file-stream-store',
  {
    state: (): FileStreamForm => ({
      fileStreamName: null,
      fileStreamTemplate: null,
      scheduleType: 'interval',
      intervalUnits: 'minutes',
      intervalValue: null,
      crontabValue: null,
      scheduleStartTime: null,
      fileAccessType: 'local_file',
      localFilePath: null,
      website: null,
      headerLabelRow: null,
      dataStartsOn: 1,
      timestampColumn: null,
      timestampFormat: null,
      timestampOffset: null,
      datastreams: [],
      selectedDatastream: null,
      formPage: 1
    }),
    getters: {
      selectedColumn: (state: FileStreamForm) => () => {
        if (state.formPage === 3) {
          return null
        } else {
          return null
        }
      }
    },
    actions: {
      loadFileStream(fileStreamName, fileStream) {
        this.fileStreamName = fileStreamName
        this.scheduleType = 'crontab'
        this.crontabValue = fileStream.crontab
        this.scheduleStartTime = fileStream.start_time
        this.fileAccessType = 'local_file'
        this.localFilePath = fileStream.file_access.path
        this.headerLabelRow = fileStream.file_access.header_label_row
        this.dataStartsOn = fileStream.file_access.data_starts_on
        this.timestampColumn = fileStream.file_timestamp.column
        this.timestampFormat = fileStream.file_timestamp.format
        this.datastreams = fileStream.data_streams.map(datastream => ({
          dataStreamId: datastream.datastream_id,
          dataStreamColumn: datastream.column
        }))
      },
      loadTemplate() {

      },
      saveFileStream() {

      }
    }
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFileStreamFormStore, import.meta.hot))
}
