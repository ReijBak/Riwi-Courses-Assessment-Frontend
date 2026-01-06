<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCourseStore } from '@/stores/courses'

const props = defineProps<{
  course: { id: string; title: string } | null
}>()

const emit = defineEmits<{
  close: []
}>()

const courseStore = useCourseStore()
const title = ref('')

watch(
  () => props.course,
  (newCourse) => {
    title.value = newCourse?.title || ''
  },
  { immediate: true },
)

async function handleSubmit() {
  if (!title.value.trim()) return

  if (props.course) {
    await courseStore.updateCourse(props.course.id, { title: title.value })
  } else {
    await courseStore.createCourse({ title: title.value })
  }

  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 pb-0">
        <h2 class="text-xl font-semibold text-slate-800">
          {{ course ? 'Edit Course' : 'New Course' }}
        </h2>
        <button
          @click="emit('close')"
          class="text-3xl text-gray-400 hover:text-gray-600 leading-none"
        >
          ×
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="mb-6">
          <label for="title" class="block mb-2 text-gray-600 font-medium">
            Course Title
          </label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="e.g., Introduction to Vue.js"
            required
            autofocus
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div v-if="courseStore.error" class="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-center text-sm">
          {{ courseStore.error }}
        </div>

        <div class="flex gap-3 justify-end">
          <button
            type="button"
            @click="emit('close')"
            class="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:border-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="courseStore.loading || !title.trim()"
            class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {{ courseStore.loading ? 'Saving...' : course ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
