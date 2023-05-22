<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6">
        DATASTREAM SELECTOR
      </div>
      <div class="col-xs-12 col-sm-6 q-col-gutter-y-md">
        <q-table
          :columns="datastreamColumns"
          :rows="formStore.datastreams"
          :filter="filter"
          class="disable-hover"
          flat dense bordered
        >
          <template v-slot:[`body-cell-datastream`]="props">
            <q-td :props="props" v-if="props.row.recordId === formStore.editingDatastream">
              <q-select
                v-model="formStore.datastreams[formStore.datastreams.findIndex(obj => obj.recordId === props.row.recordId)].datastreamId"
                :options="[
                  { datastreamId: '1451e3c2-6519-4d1f-aaff-15d652a54db0', thingName: 'LRO1', varName: 'Temperature' },
                  { datastreamId: '04c0c2f6-6c43-4aef-b204-2aaa939d64f0', thingName: 'LRO2', varName: 'Temperature' },
                  { datastreamId: '5a5c145e-54d2-49be-960c-099340582758', thingName: 'LRO3', varName: 'Temperature' }
                ]"
                :option-label="(obj) => {
                  if (obj.varName !== undefined) {
                    return obj.varName + ' at ' + obj.thingName + ' : ' + obj.datastreamId
                  } else {
                    return null
                  }
                }"
                dense borderless
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.varName + ' at ' + scope.opt.thingName }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.datastreamId }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-td>
            <q-td :props="props" v-else>
              {{
                formStore.datastreams[formStore.datastreams.findIndex(obj => obj.recordId === props.row.recordId)].datastreamId.varName
                + ' at ' + formStore.datastreams[formStore.datastreams.findIndex(obj => obj.recordId === props.row.recordId)].datastreamId.thingName
                + ' : ' + formStore.datastreams[formStore.datastreams.findIndex(obj => obj.recordId === props.row.recordId)].datastreamId.datastreamId
              }}
            </q-td>
          </template>
          <template v-slot:[`body-cell-column`]="props">
            <q-td :props="props" v-if="props.row.recordId === formStore.editingDatastream">
              <q-select
                v-model="formStore.datastreams[formStore.datastreams.findIndex(obj => obj.recordId === props.row.recordId)].datastreamColumn"
                :options="crops.fileHeaders"
                dense borderless
              ></q-select>
            </q-td>
            <q-td :props="props" v-else>
              {{ props.row.datastreamColumn ? props.row.datastreamColumn.label : null }}
            </q-td>
          </template>
          <template v-slot:[`body-cell-actions`]="props">
            <q-td :props="props" v-if="props.row.recordId === formStore.editingDatastream">
              <q-btn round flat size="sm" icon="done" @click="formStore.editingDatastream=null" />
              <q-btn round flat size="sm" icon="close" @click="formStore.editingDatastream=null" />
            </q-td>
            <q-td :props="props" v-else>
              <q-btn round flat size="sm" icon="edit" @click="formStore.editingDatastream=props.row.recordId" />
              <q-btn round flat size="sm" icon="delete" @click="formStore.deleteDatastream(props.row.recordId)" />
            </q-td>
          </template>
          <template v-slot:top-left>
            <q-input outlined dense v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:top-right>
            <q-btn color="primary" round unelevated size="sm" icon="add" @click="formStore.addDatastream()" />
            <q-btn round flat size="sm" icon="more_vert" class="q-ml-xs" />
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import { useFileStreamFormStore } from 'stores/file-stream-form';

  const formStore = useFileStreamFormStore()

  const crops = defineProps(['fileHeaders'])

  const column = ref()
  const datastream = ref()
  const filter = ref('')

  const datastreamColumns = [
    { name: 'datastream', label: 'Datastream', align: 'left', field: 'datastreamShortDescription' },
    { name: 'column', label: 'Column', align: 'left', field: 'datastreamColumn' },
    { name: 'actions', label: 'Actions', align: 'center', field: 'actions', sortable: false, style: 'width: 100px' }
  ]

</script>

<style scoped>

</style>