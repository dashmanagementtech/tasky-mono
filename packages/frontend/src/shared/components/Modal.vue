<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { computed } from 'vue';

const emit = defineEmits(['close'])

const { heading, size = 'half' } = defineProps<{
  heading: string,
  size?: 'half' | 'third' | 'fourth'
}>()

const width = computed(() => {
  switch (size) {
    case 'fourth':
      return 'w-1/4'

    case 'third':
      return 'w-1/3'

    default:
      return 'w-1/2'
  }
})
</script>

<template>
  <section class="fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-[20] flex flex-col items-center justify-center">
    <div class="bg-white rounded-xl shadow-2xl max-h-2/3 px-5" :class="width">
      <div class="border-primary-50 border-b py-5 flex items-center justify-between">
        <h2 class="font-semibold">
          {{ heading }}
        </h2>
        <el-icon color="#fb2c36" class="cursor-pointer" @click="emit('close')">
          <Close />
        </el-icon>
      </div>
      <div class="py-5">
        <slot />
      </div>
    </div>
  </section>
</template>
