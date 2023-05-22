<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 q-col-gutter-y-md">
        <div class="row">
          <div class="col">
            <q-select
              label="Timestamp Column"
              hint="Select the column containing the timestamp."
              v-model="formStore.timestampColumn"
              :options="props.fileHeaders"
              outlined dense clearable
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input
              label="Timestamp Format"
              hint="Select or enter the timestamp format used in this file."
              v-model="formStore.timestampFormat"
              outlined dense clearable
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-select
              label="Timezone Offset"
              hint="Select the timezone used for the timestamp."
              v-model="formStore.timestampOffset"
              outlined dense clearable
            />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6">
        TIMESTAMP HELPER
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useFileStreamFormStore } from 'stores/file-stream-form';

  const formStore = useFileStreamFormStore()

  const props = defineProps(['fileHeaders'])

</script>

<style scoped>

</style>