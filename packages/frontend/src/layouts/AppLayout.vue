<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import Logo from '@/shared/components/Logo.vue';
import { COMMON, ROUTES } from './utils/constants';
import LogoutIcon from './icons/LogoutIcon.vue';

const route = useRoute()
const router = useRouter()

function logUserOut() {
  router.push('/')
}
</script>

<template>
  <section class="h-screen flex bg-white">
    <nav class="w-[250px] h-screen bg-primary-50 p-5 flex flex-col justify-between">
      <div class="">
        <div class="flex items-center justify-center pb-10">
          <Logo />
        </div>
        <div class="flex flex-col gap-2">
          <router-link
            v-for="(link, key) in ROUTES"
            :to="link.uri"
            class="flex items-center gap-3 p-3 rounded hover:text-primary"
            :class="{ 'bg-primary-100 text-primary font-semibold' : route.meta.parent === link.uri }"
            :key
          >
            <component :is="link.icon" class="w-[24px]" />
            {{ link.title }}
          </router-link>
        </div>
      </div>
      <div class="">
        <div class="flex flex-col gap-2">
          <router-link
            v-for="(link, key) in COMMON"
            :to="link.uri"
            class="flex items-center gap-3 p-3 rounded hover:text-primary"
            :class="{ 'bg-primary-100 text-primary font-semibold' : route.meta.parent === link.uri }"
            :key
          >
            <component :is="link.icon" class="w-[24px]" />
            {{ link.title }}
          </router-link>
          <a href="" @click.prevent="logUserOut()" class="transition ease-in-out flex items-center gap-3 p-3 rounded bg-red-100 text-red-500 hover:bg-red-500 hover:text-red-100">
            <LogoutIcon class="w-[24px]" />
            Logout
          </a>
        </div>
      </div>
    </nav>
    <section class="w-full bg-white border-l border-primary-50 p-5">
      <header class="border-b border-primary-50 pb-5 mb-5 flex justify-between items-center">
        <h1 class="capitalize text-2xl font-semibold">
          {{ route.meta.name }}
        </h1>
        <div class=""></div>
      </header>
      <RouterView />
    </section>
  </section>
</template>
