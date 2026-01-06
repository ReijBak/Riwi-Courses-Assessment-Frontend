<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'

const router = useRouter()
const dashboardStore = useDashboardStore()
const authStore = useAuthStore()

onMounted(async () => {
  authStore.init()
  await dashboardStore.fetchMetrics()
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function navigateToCourse(id: string) {
  router.push(`/courses/${id}`)
}

function navigateToCourses() {
  router.push('/courses')
}
</script>

<template>
  <AppLayout>
    <div class="dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p class="welcome-text">
            Welcome back, <strong>{{ authStore.user?.firstName }}</strong>! 👋
          </p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" @click="navigateToCourses">
            📚 Manage Courses
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="dashboardStore.loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading metrics...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="dashboardStore.error" class="error-state">
        <p>{{ dashboardStore.error }}</p>
        <button @click="dashboardStore.fetchMetrics()">Retry</button>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content">
        <!-- Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card total">
            <div class="metric-icon">📚</div>
            <div class="metric-info">
              <span class="metric-value">{{ dashboardStore.metrics.totalCourses }}</span>
              <span class="metric-label">Total Courses</span>
            </div>
          </div>

          <div class="metric-card published">
            <div class="metric-icon">✅</div>
            <div class="metric-info">
              <span class="metric-value">{{ dashboardStore.metrics.publishedCourses }}</span>
              <span class="metric-label">Published</span>
            </div>
          </div>

          <div class="metric-card draft">
            <div class="metric-icon">📝</div>
            <div class="metric-info">
              <span class="metric-value">{{ dashboardStore.metrics.draftCourses }}</span>
              <span class="metric-label">Drafts</span>
            </div>
          </div>

          <div class="metric-card lessons">
            <div class="metric-icon">📖</div>
            <div class="metric-info">
              <span class="metric-value">{{ dashboardStore.metrics.totalLessons }}</span>
              <span class="metric-label">Total Lessons</span>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-card">
            <h3>Course Distribution</h3>
            <div class="pie-chart">
              <div class="pie-visual">
                <svg viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e0e0e0"
                    stroke-width="20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#28a745"
                    stroke-width="20"
                    :stroke-dasharray="`${(dashboardStore.metrics.publishedCourses / Math.max(dashboardStore.metrics.totalCourses, 1)) * 251.2} 251.2`"
                    stroke-dashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div class="pie-center">
                  <span class="pie-percentage">
                    {{ dashboardStore.metrics.totalCourses > 0
                      ? Math.round((dashboardStore.metrics.publishedCourses / dashboardStore.metrics.totalCourses) * 100)
                      : 0 }}%
                  </span>
                  <span class="pie-label">Published</span>
                </div>
              </div>
              <div class="pie-legend">
                <div class="legend-item">
                  <span class="legend-color published"></span>
                  <span>Published ({{ dashboardStore.metrics.publishedCourses }})</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color draft"></span>
                  <span>Draft ({{ dashboardStore.metrics.draftCourses }})</span>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h3>Quick Stats</h3>
            <div class="stats-list">
              <div class="stat-item">
                <span class="stat-label">Avg. Lessons per Course</span>
                <span class="stat-value">
                  {{ dashboardStore.metrics.totalCourses > 0
                    ? (dashboardStore.metrics.totalLessons / dashboardStore.metrics.totalCourses).toFixed(1)
                    : 0 }}
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Publication Rate</span>
                <span class="stat-value">
                  {{ dashboardStore.metrics.totalCourses > 0
                    ? Math.round((dashboardStore.metrics.publishedCourses / dashboardStore.metrics.totalCourses) * 100)
                    : 0 }}%
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">User Role</span>
                <span class="stat-value role" :class="{ admin: authStore.isAdmin }">
                  {{ authStore.isAdmin ? 'Administrator' : 'User' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Courses -->
        <div class="recent-section">
          <div class="section-header">
            <h3>📅 Recent Activity</h3>
            <button class="btn-link" @click="navigateToCourses">View All →</button>
          </div>

          <div v-if="dashboardStore.metrics.recentCourses.length > 0" class="recent-list">
            <div
              v-for="course in dashboardStore.metrics.recentCourses"
              :key="course.id"
              class="recent-item"
              @click="navigateToCourse(course.id)"
            >
              <div class="recent-info">
                <span class="recent-title">{{ course.title }}</span>
                <span class="recent-meta">
                  {{ course.totalLessons }} lessons • Updated {{ formatDate(course.lastModified) }}
                </span>
              </div>
              <span :class="['status-badge', course.status.toLowerCase()]">
                {{ course.status }}
              </span>
            </div>
          </div>

          <div v-else class="empty-recent">
            <p>No courses yet. Create your first course!</p>
            <button class="btn-primary" @click="navigateToCourses">
              + Create Course
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.dashboard {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}

.welcome-text {
  color: #666;
  margin: 0;
  font-size: 15px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.metric-card.total .metric-icon {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
}

.metric-card.published .metric-icon {
  background: #d4edda;
}

.metric-card.draft .metric-icon {
  background: #fff3cd;
}

.metric-card.lessons .metric-icon {
  background: #e3f2fd;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1;
}

.metric-label {
  font-size: 14px;
  color: #666;
  margin-top: 6px;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.chart-card h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #1a1a2e;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 30px;
}

.pie-visual {
  position: relative;
  width: 140px;
  height: 140px;
}

.pie-visual svg {
  width: 100%;
  height: 100%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-percentage {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
}

.pie-label {
  font-size: 12px;
  color: #666;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #555;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.published {
  background: #28a745;
}

.legend-color.draft {
  background: #e0e0e0;
}

/* Stats List */
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.stat-value.role {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f0f0f0;
}

.stat-value.role.admin {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
}

/* Recent Section */
.recent-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1a2e;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
}

.btn-link:hover {
  color: #764ba2;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.recent-item:hover {
  background: #f0f2f5;
  transform: translateX(4px);
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-title {
  font-weight: 600;
  color: #1a1a2e;
}

.recent-meta {
  font-size: 13px;
  color: #888;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.published {
  background: #d4edda;
  color: #155724;
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.empty-recent {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-recent .btn-primary {
  margin-top: 16px;
}
</style>

