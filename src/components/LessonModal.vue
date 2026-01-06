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
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ lesson ? 'Editar Lección' : 'Nueva Lección' }}</h2>
        <button class="btn-close" @click="emit('close')">×</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Título de la Lección</label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Ej: Introducción al tema"
            required
            autofocus
          />
        </div>

        <div class="form-group">
          <label for="order">Orden</label>
          <input
            id="order"
            v-model.number="order"
            type="number"
            min="1"
            required
          />
          <p class="hint">
            El orden debe ser único dentro del curso.
            {{ lesson ? '' : `Siguiente orden disponible: ${nextOrder}` }}
          </p>
        </div>

        <div v-if="lessonStore.error" class="error-message">
          {{ lessonStore.error }}
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="emit('close')">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn-submit"
            :disabled="lessonStore.loading || !title.trim()"
          >
            {{ lessonStore.loading ? 'Guardando...' : lesson ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}

.btn-close:hover {
  color: #333;
}

form {
  padding: 24px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input[type='number'] {
  width: 120px;
}

.hint {
  font-size: 13px;
  color: #888;
  margin: 8px 0 0;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 12px 24px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #999;
}

.btn-submit {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

