<template>
  <div class="q-px-md">
    <q-table
      class="disable-hover file-previewer sticky-header sticky-index border"
      :columns="tableHeaders"
      :rows="tableItems"
      :pagination="pagination"
      separator="cell"
      flat bordered dense hide-bottom
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            @mouseenter="hoveredColumn=col.name"
            @mouseleave="hoveredColumn=null"
            @click="handleColumnClick(col.name)"
            :class="{
              'column-hover': checkColumnHover(col),
              'column-select': checkColumnSelect(col),
              'column-select-hover': checkColumnHoverSelect(col)
            }"
          >{{ col.label }}</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            @mouseenter="hoveredColumn=col.name"
            @mouseleave="hoveredColumn=null"
            @click="handleColumnClick(col.name)"
            :class="{
              'column-hover': checkColumnHover(col),
              'column-select': checkColumnSelect(col),
              'column-select-hover': checkColumnHoverSelect(col)
            }"
          >{{ props.row[col.field] }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch } from 'vue';
  import { electronApi } from 'src/api/electron-api'

  const $papa = inject("$papa");
  const props = defineProps(['filePath', 'columnHeaderRow', 'headerRows', 'footerRows', 'selectedColumn'])

  const fileData = ref(null)
  const tableHeaders = ref([])
  const tableItems = ref([])
  const hoveredColumn = ref()

  const getColumnName = (i) => {
    const r = i % 26
    const c = String.fromCharCode(65 + r)
    const q = i - r
    return q > 0 ? getColumnName((q - 1) / 26) + c : c
  }

  const setHeaders = () => {
    let headers = props.columnHeaderRow ?
      fileData.value.data[props.columnHeaderRow - 1] :
      Array(fileData.value.data[0].length).keys()
    tableHeaders.value = ['index', ...headers].map(key => {
      const columnName = props.columnHeaderRow ? key : getColumnName(key)
      return key === 'index' ?
        { label: '', name: key, field: key, sortable: false, fixed: true, style: "width: 30px"} :
        { label: columnName, name: columnName, field: columnName, sortable: false}
      })
  }

  const setItems = () => {
    tableItems.value = fileData.value.data.map((item, index) => {
      return tableHeaders.value.reduce((obj, header, currentIndex) => {
        obj[header.field] = header.field === 'index' ? index + 1 : item[currentIndex - 1];
        return obj
      }, {});
    }).slice(
      props.headerRows ? props.headerRows : undefined,
      props.footerRows ? -props.footerRows : undefined
    )
  }

  const parseFile = async () => {
    const rawFileData = await electronApi.invoke('parse-file', props.filePath);
    try {
      fileData.value = $papa.parse(rawFileData);
      setHeaders()
      setItems()
    } catch (e) {
      fileData.value = null;
    }
  }

  const checkColumnHover = (col) => {
    return hoveredColumn.value === col.name && col.name !== 'index' && col.name !== props.selectedColumn()
  }

  const checkColumnSelect = (col) => {
    return col.name === props.selectedColumn() && hoveredColumn.value !== col.name
  }

  const checkColumnHoverSelect = (col) => {
    return col.name === props.selectedColumn() && hoveredColumn.value === col.name
  }

  const handleColumnClick = (column) => {
    if ( column !== 'index' ) {
      emit('columnClicked', column)
    }
  }

  const pagination = {
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 30
  }

  if (fileData.value === null && props.filePath !== null) {
    parseFile()
  }

  watch(
    () => props.filePath,
    () => {
      parseFile();
    }
  )

  watch(
    () => props.columnHeaderRow,
    () => {
      setHeaders();
      setItems();
    }
  )

  watch(
    () => props.headerRows,
    () => {
      setItems();
    }
  )

  const emit = defineEmits(['columnClicked'])

  defineExpose({tableHeaders})

</script>

<style scoped>

  .file-previewer {
    height: 200px;
  }

</style>