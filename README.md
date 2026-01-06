# 🎓 Riwi Courses - Frontend

Frontend en Vue.js 3 para la plataforma de gestión de cursos online.

## 🚀 Características

- ✅ **Dashboard con Métricas** - Panel principal con estadísticas y gráficos
- ✅ **Sidebar de Navegación** - Menú lateral responsive con hamburguesa en móvil
- ✅ **Autenticación JWT** - Login y registro de usuarios
- ✅ **Gestión de Cursos** - CRUD completo con filtros y paginación
- ✅ **Gestión de Lecciones** - CRUD con reordenamiento
- ✅ **Sistema de Roles** - Diferenciación Admin/User
- ✅ **Diseño Responsivo** - Funciona en dispositivos móviles
- ✅ **TypeScript** - Tipado estático completo
- ✅ **Pinia** - Gestión de estado moderna
- ✅ **Vue Router** - Navegación con guards de autenticación
- ✅ **Tailwind CSS 4** - Framework CSS utility-first

## 🐳 Docker

### Build y ejecutar con Docker

```bash
# Build de la imagen
docker build -t riwi-courses-frontend .

# Ejecutar contenedor
docker run -p 3000:80 riwi-courses-frontend
```

### Con Docker Compose (sistema completo)

```bash
# Desde la raíz del proyecto
cd ..
docker compose up -d
```

Acceder a: http://localhost:3000

## 📋 Requisitos

- Node.js 20.x o superior
- npm o yarn
- Backend API corriendo (puerto 5023 por defecto)

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env

# Ejecutar en modo desarrollo
npm run dev
```

## ⚙️ Configuración

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5023/api
```

## 📁 Estructura del Proyecto

```
src/
├── api/                 # Cliente HTTP con Axios
├── components/          # Componentes reutilizables
│   ├── AppLayout.vue    # Layout principal con sidebar
│   ├── SidebarMenu.vue  # Menú de navegación lateral
│   ├── CourseCard.vue
│   ├── CourseModal.vue
│   ├── LessonCard.vue
│   └── LessonModal.vue
├── router/              # Configuración de Vue Router
├── stores/              # Stores de Pinia
│   ├── auth.ts         # Estado de autenticación
│   ├── courses.ts      # Estado de cursos
│   ├── lessons.ts      # Estado de lecciones
│   └── dashboard.ts    # Estado de métricas del dashboard
├── types/               # Tipos TypeScript
├── views/               # Vistas/Páginas
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── DashboardView.vue # Dashboard con métricas
│   ├── CoursesView.vue
│   └── CourseDetailView.vue
├── App.vue
└── main.ts
```

## 🔐 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@riwi.io | Admin123! |
| User | user@riwi.io | User123! |

## 📊 Funcionalidades

### Dashboard
- Métricas de cursos (total, publicados, borradores)
- Total de lecciones
- Gráfico de distribución de cursos
- Actividad reciente
- Estadísticas rápidas

### Cursos
- Listar cursos con paginación
- Filtrar por estado (Borrador/Publicado)
- Buscar por título
- Crear, editar y eliminar cursos
- Publicar/Despublicar cursos

### Lecciones
- Listar lecciones ordenadas
- Crear, editar y eliminar lecciones
- Reordenar lecciones (subir/bajar)

### Autenticación
- Login con JWT
- Registro de nuevos usuarios
- Persistencia de sesión
- Logout

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview

# Tests unitarios
npm run test:unit

# Linting
npm run lint

# Formateo de código
npm run format
```

## 🎨 Tecnologías

- **Vue 3** - Framework frontend
- **TypeScript** - Tipado estático
- **Pinia** - Gestión de estado
- **Vue Router** - Navegación
- **Axios** - Cliente HTTP
- **Vite** - Build tool

## 📱 Capturas de Pantalla

La aplicación incluye:
- Pantalla de Login con credenciales de demo
- Listado de cursos con tarjetas interactivas
- Detalle de curso con gestión de lecciones
- Modales para crear/editar cursos y lecciones

---

Desarrollado para el Assessment Técnico de Riwi 🎓

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
