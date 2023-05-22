<template>
  <q-btn-group flat>
    <q-btn
      label="Cancel"
      flat
      @click="emit('cancelled')"
    />
    <q-btn
      v-if="pages.indexOf(page) > 0"
      label="Previous"
      flat
      @click="emit('newPage', pages[pages.indexOf(page) - 1])"
      :class="{ visible: pages.indexOf(page) > 0 }"
    />
    <q-btn
      v-if="pages.indexOf(page) + 1 < pages.length"
      label="Next"
      flat
      @click="emit('newPage', pages[pages.indexOf(page) + 1])"
    />
    <q-btn
      v-if="pages.indexOf(page) + 1 === pages.length"
      label="Save"
      flat
      @click="emit('confirmed')"
    />
  </q-btn-group>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  defineProps(['pages', 'page'])
  const emit = defineEmits(['confirmed', 'cancelled', 'newPage'])

</script>

<style scoped>

</style>