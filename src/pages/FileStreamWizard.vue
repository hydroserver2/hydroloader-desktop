<template>
  <q-page class="bg-auto column">
    <q-header flat class="bg-auto">
      <q-toolbar>
        <q-toolbar-title>Add File Stream</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-stepper flat v-model="formStore.formPage" ref="stepper" color="primary no-border" class="col-grow">
      <q-step :name="1" title="Configuration" icon="edit" :done="formStore.formPage > 1" >
        <FileStreamConfiguration
          v-if="formStore.formPage === 1"
        />
      </q-step>
      <q-step :name="2" title="Timestamp" icon="av_timer" :done="formStore.formPage > 2" >
          <FileStreamTimestamp
            v-if="formStore.formPage === 2"
            :fileHeaders="filePreview ? filePreview.tableHeaders.slice(1) : []"
          />
      </q-step>
      <q-step :name="3" title="Datastreams" icon="timeline" >
          <FileStreamDatastreams
            v-if="formStore.formPage === 3"
            :fileHeaders="filePreview ? filePreview.tableHeaders.slice(1) : []"
          />
      </q-step>
      <template v-slot:message>
        <div class="q-px-lg">
          <FilePreviewer
            ref="filePreview"
            :filePath="formStore.localFilePath"
            :columnHeaderRow="formStore.headerLabelRow"
            :headerRows="formStore.dataStartsOn"
            :selectedColumn="formStore.selectedColumn"
            :key="filePreviewKey"
            @columnClicked="handleClickedColumn"
          />
        </div>
      </template>
    </q-stepper>
    <q-footer flat class="bg-auto">
      <q-toolbar class="justify-end">
        <q-stepper-navigation class="q-pb-sm">
          <q-btn flat color="primary" label="Cancel" class="q-mr-sm" @click="handleCancel"/>
          <q-btn v-if="formStore.formPage > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-mr-sm" />
          <q-btn v-if="formStore.formPage < 3" @click="$refs.stepper.next()" color="primary" label="Next" />
          <q-btn v-if="formStore.formPage === 3" color="primary" label="Save" />
        </q-stepper-navigation>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { electronApi } from 'src/api/electron-api'
  import { useRoute } from 'vue-router';
  import FileStreamConfiguration from "components/FileStreamConfiguration.vue";
  import FileStreamTimestamp from "components/FileStreamTimestamp.vue";
  import FileStreamDatastreams from "components/FileStreamDatastreams.vue";
  import FilePreviewer from "components/FilePreviewer.vue";

  import { useFileStreamSummaryStore } from "stores/file-stream-summary";
  import { useFileStreamFormStore } from "stores/file-stream-form";

  const fileStreamStore = useFileStreamSummaryStore()
  const formStore = useFileStreamFormStore()

  const route = useRoute()

  const filePreview = ref(null)
  const filePreviewKey = ref(1)

  const handleCancel = () => {
    console.log(route.query.id)
    electronApi.invoke('close-modal', route.query.id)
  }

  const handleClickedColumn = (col) => {
    if (formStore.formPage === 2) {
      formStore.timestampColumn = col
    } else if (formStore.formPage === 3) {
      formStore.timestampColumn = col
    } else {

    }
  }

  if (fileStreamStore.activeFileStreamId !== 'null') {
    formStore.loadFileStream(
      fileStreamStore.activeFileStreamId,
      fileStreamStore.fileStreamConfs[fileStreamStore.activeFileStreamId]
    )
  }

</script>

<style scoped lang="scss">

</style>