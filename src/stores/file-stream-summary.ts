import { extend, LocalStorage } from 'quasar'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { FileStreamConfig } from 'src/models/file_stream_config'
import { FileStreamStatus } from 'src/models/file_stream_statuses'
import { electronApi } from 'src/api/electron-api'

interface FileStreamConfs {
  [key: string]: FileStreamConfig
}

interface FileStreamStatuses {
  [key: string]: FileStreamStatus
}

interface FileStreamSummary {
  fileStreamConfs: FileStreamConfs,
  fileStreamStatuses: FileStreamStatuses,
  activeFileStreamId: string
}

export const useFileStreamSummaryStore = defineStore(
  'file_stream_summary',
  {
    state: (): FileStreamSummary => ({
      fileStreamConfs: (LocalStorage.getItem('fileStreamConfs') || {}),
      fileStreamStatuses: (LocalStorage.getItem('fileStreamStatuses') || {}),
      activeFileStreamId: (LocalStorage.getItem('activeFileStreamId') || '')
    }),
    getters: {
      fileStreamRows({ fileStreamConfs, fileStreamStatuses }): {}[] {
        return Object.keys(fileStreamConfs).map(name => ({
          name: name,
          location: fileStreamConfs[name].file_access.path,
          health: fileStreamStatuses[name].health,
          status: fileStreamStatuses[name].status,
          dataThru: fileStreamStatuses[name].dataThru,
          lastSynced: fileStreamStatuses[name].lastSynced
        }))
      }
    },
    actions: {
      setActiveFileStream(fileStreamId) {
        this.activeFileStreamId = fileStreamId
        LocalStorage.set('activeFileStreamId', fileStreamId)
      },
      async fetchFileStreams() {
        const fileStreams = await electronApi.invoke('fetch-file-streams')
        this.fileStreamConfs = extend(true, {}, fileStreams.reduce((obj, fileStream) => {
          obj[fileStream['name']] = fileStream['conf']
          return obj
        }, {}))
        LocalStorage.set('fileStreamConfs', this.fileStreamConfs)
        for (const name in this.fileStreamConfs) {
          if (!(name in this.fileStreamStatuses)) {
            this.fileStreamStatuses[name] = {
              status: null,
              health: null,
              lastSynced: null,
              dataThru: null,
              paused: false
            }
          }
        }
        LocalStorage.set('fileStreamStatuses', this.fileStreamStatuses)
      }
    }
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFileStreamSummaryStore, import.meta.hot))
}