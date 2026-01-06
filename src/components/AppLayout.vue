<script setup lang="ts">
import SidebarMenu from '@/components/SidebarMenu.vue'
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <SidebarMenu />
    <main class="flex-1 ml-64 min-h-screen w-full">
      <slot />
    </main>
  </div>
</template>
