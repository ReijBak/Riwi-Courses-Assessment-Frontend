<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (success) {
    router.push('/courses')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🎓 Riwi Courses</h1>
      <h2>Iniciar Sesión</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button type="submit" :disabled="authStore.loading" class="btn-primary">
          {{ authStore.loading ? 'Cargando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p class="register-link">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </p>

      <div class="demo-credentials">
        <p><strong>Usuarios de prueba:</strong></p>
        <p>Admin: admin@riwi.io / Admin123!</p>
        <p>User: user@riwi.io / User123!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #667eea;
  margin-bottom: 10px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-weight: 500;
}

.form-group {
  margin-bottom: 20px;
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
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

.demo-credentials {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
}

.demo-credentials p {
  margin: 5px 0;
}
</style>

