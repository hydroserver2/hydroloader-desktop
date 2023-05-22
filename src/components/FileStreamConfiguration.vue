<template>
  <div class="q-pa-md q-col-gutter-y-md">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6">
        <q-input
          label="File Stream Name"
          hint="Create a unique name to identify the file stream."
          v-model="formStore.fileStreamName"
          outlined dense
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input
          label="Start Time"
          hint="Enter a time to begin streaming data."
          v-model="formStore.scheduleStartTime"
          outlined dense clearable
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6">
        <q-radio v-model="formStore.scheduleType" val="interval" label="Interval" />
        <q-radio v-model="formStore.scheduleType" val="crontab" label="Crontab" />
      </div>
      <div v-if="formStore.scheduleType === 'interval'" class="col-xs-6 col-sm-3">
        <q-input
          label="Interval"
          hint="Upload interval."
          v-model="formStore.intervalValue"
          outlined dense type="number"
        />
      </div>
      <div v-if="formStore.scheduleType === 'interval'" class="col-xs-6 col-sm-3">
        <q-select
          label="Units"
          hint="Interval units."
          v-model="formStore.intervalUnits"
          :options="['minutes', 'hours', 'days']"
          outlined dense type="number"
        />
      </div>
      <div v-if="formStore.scheduleType === 'crontab'" class="col-xs-12 col-sm-6">
        <q-input
          label="Crontab"
          hint="Upload crontab schedule."
          v-model="formStore.crontabValue"
          outlined dense
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6">
        <q-radio v-model="formStore.fileAccessType" val="local_file" label="Local File" />
        <q-radio v-model="formStore.fileAccessType" val="website" label="Website" />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input
          label="Local File Path"
          hint="Select a file or enter a local file path to stream data from."
          v-model="formStore.localFilePath"
          outlined dense
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6">
        <q-input
          label="Column Label Row"
          hint="Enter the row index that contains column labels."
          v-model="formStore.headerLabelRow"
          outlined dense type="number"
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input
          label="Data Start Row"
          hint="Enter the row index data starts on."
          v-model="formStore.dataStartsOn"
          outlined dense type="number"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useFileStreamFormStore } from 'stores/file-stream-form';

  const formStore = useFileStreamFormStore()
</script>

<style scoped>

</style>