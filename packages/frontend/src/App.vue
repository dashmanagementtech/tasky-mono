<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const  route = useRoute()

// const layout = computed(() => route.meta.layout === 'auth' ? AuthLayout : AppLayout)
</script>

<template>
  <component :is="route.meta.layout === 'app' ? AppLayout : AuthLayout">
    <RouterView />
  </component>
</template>
