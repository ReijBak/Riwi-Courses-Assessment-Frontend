<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLessonStore } from '@/stores/lessons'

const props = defineProps<{
  lesson: { id: string; title: string; order: number } | null
  courseId: string
  nextOrder: number
}>()

const emit = defineEmits<{
  close: []
}>()

const lessonStore = useLessonStore()
const title = ref('')
const order = ref(1)

watch(
  () => props.lesson,
  (newLesson) => {
    if (newLesson) {
      title.value = newLesson.title
      order.value = newLesson.order
    } else {
      title.value = ''
      order.value = props.nextOrder
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  if (!title.value.trim()) return

  if (props.lesson) {
    await lessonStore.updateLesson(
      props.lesson.id,
      { title: title.value, order: order.value },
      props.courseId,
    )
  } else {
    await lessonStore.createLesson({
      courseId: props.courseId,
      title: title.value,
      order: order.value,
    })
  }

  if (!lessonStore.error) {
    emit('close')
  }
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
          {{ lesson ? 'Edit Lesson' : 'New Lesson' }}
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
        <div class="mb-5">
          <label for="title" class="block mb-2 text-gray-600 font-medium">
            Lesson Title
          </label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="e.g., Introduction to the topic"
            required
            autofocus
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div class="mb-6">
          <label for="order" class="block mb-2 text-gray-600 font-medium">
            Order
          </label>
          <input
            id="order"
            v-model.number="order"
            type="number"
            min="1"
            required
            class="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
          <p class="text-sm text-gray-400 mt-2">
            Order must be unique within the course.
            {{ lesson ? '' : `Next available: ${nextOrder}` }}
          </p>
        </div>

        <div v-if="lessonStore.error" class="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-center text-sm">
          {{ lessonStore.error }}
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
            :disabled="lessonStore.loading || !title.trim()"
            class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {{ lessonStore.loading ? 'Saving...' : lesson ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
