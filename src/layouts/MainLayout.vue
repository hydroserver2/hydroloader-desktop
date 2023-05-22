<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="navigation"
      show-if-above
      bordered
      :mini="!navigation || minimized"
      :width="200"
      :breakpoint="500"
      @click.capture="handleNavClick"
    >
      <q-list>
        <q-item
          v-for="page in pages"
          :key="page.title"
          :to="page.page"
          v-bind="page"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="page.icon" />
          </q-item-section>
          <q-item-section>
            {{ page.title }}
          </q-item-section>
        </q-item>
      </q-list>
      <div class="q-mini-drawer-hide absolute" style="top: 31px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          @click="minimized = true"
        />
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps({ route: String })

  const pages = [
    {
      title: 'File Streams',
      icon: 'cloud_upload',
      page: '/main/file-streams'
    },
    {
      title: 'File Templates',
      icon: 'content_copy',
      page: '/main/file-templates'
    },
    {
      title: 'Monitoring',
      icon: 'query_stats',
      page: '/main/file-monitoring'
    }
  ];

  const navigation = ref(true)
  const minimized = ref(false)

  const handleNavClick = (e) => {
    if (minimized.value) {
      minimized.value = false
      e.stopPropagation()
    }
  }

</script>
