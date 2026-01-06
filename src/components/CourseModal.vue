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
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ course ? 'Editar Curso' : 'Nuevo Curso' }}</h2>
        <button class="btn-close" @click="emit('close')">×</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Título del Curso</label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Ej: Introducción a Vue.js"
            required
            autofocus
          />
        </div>

        <div v-if="courseStore.error" class="error-message">
          {{ courseStore.error }}
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="emit('close')">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn-submit"
            :disabled="courseStore.loading || !title.trim()"
          >
            {{ courseStore.loading ? 'Guardando...' : course ? 'Actualizar' : 'Crear' }}
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

