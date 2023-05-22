<template>
  <q-page class="q-pa-md column items-center full-height full-width">
    <q-table
      :columns="fileStreamColumns"
      :rows="fileStreamSummaryStore.fileStreamRows"
      row-key="name"
      no-hover
      selection="multiple"
      :filter="fileStreamFilter"
      :visible-columns="visibleColumns()"
      v-model:selected="fileDetailsSelection"
      v-model:pagination="fileDetailsPagination"
      flat
      table-class="file-stream-table"
      class="file-stream-table dark-table disable-hover full-width col-grow"
    >
      <template v-slot:[`body-cell-actions`]="props">
        <q-td :props="props">
          <q-btn
            v-if="fileStreamSummaryStore.fileStreamStatuses[props.key].paused === true"
            round
            flat
            size="md"
            icon="play_arrow"
            @click="() => fileStreamSummaryStore.fileStreamStatuses[props.key].paused = false"
          />
          <q-btn
            v-if="fileStreamSummaryStore.fileStreamStatuses[props.key].paused === false"
            round
            flat
            size="md"
            icon="pause"
            @click="() => fileStreamSummaryStore.fileStreamStatuses[props.key].paused = true"
          />
          <q-btn
            round
            flat
            size="md"
            icon="more_vert"
          >
            <q-menu>
              <q-list>
                <q-item v-for="action in rowActions" clickable v-close-popup @click="action.click(props.key)">
                  <q-item-section avatar>
                    <q-avatar :icon="action.icon" />
                  </q-item-section>
                  <q-item-section>{{ action.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:top-left>
        <q-input outlined dense v-model="fileStreamFilter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-toggle
          v-model="showFileLocation"
          label="Show File Location?"
          class="q-ml-xl"
        />
      </template>
      <template v-slot:top-right>
        <q-btn
          color="primary"
          round
          unelevated
          size="md"
          icon="add"
          @click="handleOpenFileStreamModal(null)"
        />
        <q-btn
          round
          flat
          icon="more_vert"
          class="q-ml-xs"
          :disabled="fileDetailsSelection.length === 0"
        >
          <q-menu>
            <q-list>
              <q-item v-for="action in groupActions" clickable v-close-popup>
                <q-item-section avatar>
                  <q-avatar :icon="action.icon" />
                </q-item-section>
                <q-item-section>{{ action.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useFileStreamSummaryStore } from "stores/file-stream-summary"
  import { electronApi } from 'src/api/electron-api'

  const fileStreamSummaryStore = useFileStreamSummaryStore()
  const showFileLocation = ref(false)
  const fileStreamFilter = ref('')
  const fileDetailsPagination = ref({ rowsPerPage: 25 })
  const fileDetailsSelection = ref([])

  const visibleColumns = () => {
    return fileStreamColumns.map(col => col.name).filter(col => showFileLocation.value === true || col !== 'location')
  }

  const handleOpenFileStreamModal = (fileStreamId) => {
    fileStreamSummaryStore.setActiveFileStream(fileStreamId)
    electronApi.invoke('open-modal', 'file_stream_wizard', 'main')
  }

  const fileStreamColumns = [
    { name: 'name', label: 'Name', align: 'left', field: 'name' },
    { name: 'location', label: 'Location', align: 'left', field: 'location' },
    { name: 'health', label: 'Health', align: 'center', field: 'health' },
    { name: 'status', label: 'Status', align: 'center', field: 'status' },
    { name: 'dataThru', label: 'Data Thru', align: 'left', field: 'dataThru', required: false },
    { name: 'lastSynced', label: 'Last Synced', align: 'left', field: 'lastSynced', required: false },
    { name: 'actions', label: 'Actions', align: 'center', field: 'actions', sortable: false, required: false }
  ];

  const groupActions = [
    { label: 'Upload Data', icon: 'cloud_upload' },
    { label: 'Activate All', icon: 'play_arrow' },
    { label: 'Pause All', icon: 'pause' },
    { label: 'Refresh Table', icon: 'refresh' },
    { label: 'Delete Datastreams', icon: 'delete' }
  ]

  const rowActions = [
    { label: 'Upload Data', icon: 'cloud_upload' },
    { label: 'Edit Datastream', icon: 'edit', click: handleOpenFileStreamModal },
    { label: 'Delete Datastream', icon: 'delete' }
  ]

  fileStreamSummaryStore.fetchFileStreams()

</script>

<style module lang="scss">
  @import '../css/app.scss';

  .disable-hover tbody td:before {
      background: transparent;
  }

</style>
