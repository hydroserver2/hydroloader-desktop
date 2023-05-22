<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view
        :id="props.id"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  const props = defineProps({ id: String })
</script>
