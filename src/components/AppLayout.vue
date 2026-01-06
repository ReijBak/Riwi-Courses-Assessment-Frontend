<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SidebarMenu from '@/components/SidebarMenu.vue'

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <SidebarMenu />
    <main
      class="flex-1 min-h-screen w-full transition-all duration-300"
      :class="isMobile ? 'ml-0 pt-16' : 'ml-64'"
    >
      <slot />
    </main>
  </div>
</template>
