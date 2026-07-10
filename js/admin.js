// Admin Panel Logic
let allCourses = [];
let allUsers = [];

// Auth guard
AuthManager.onAuthChange((user, userData) => {
  if (!user) { window.location.href = 'login.html'; return; }
  if (!userData || (userData.role !== 'admin' && userData.role !== 'instructor')) {
    window.location.href = 'dashboard.html';
    return;
  }
  initAdmin(user, userData);
});

function initAdmin(user, userData) {
  const name = userData.name || user.email.split('@')[0];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('adminAvatar').textContent = initials;
  document.getElementById('adminName').textContent = name;
  loadDashboardStats();
  loadCourses();
  loadUsers();
}

// Navigation
document.querySelectorAll('.admin-nav a[data-panel]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + link.dataset.panel).classList.add('active');
  });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => { e.preventDefault(); AuthManager.logout(); });
document.getElementById('sidebarLogout').addEventListener('click', (e) => { e.preventDefault(); AuthManager.logout(); });

// Mobile sidebar
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('adminSidebar').classList.toggle('active');
});

// Dashboard stats
async function loadDashboardStats() {
  try {
    const courses = await window.fb.getCourses(false);
    const users = await window.fb.getAllUsers();
    const enrollmentsSnapshot = await window.firebaseDB.collection('enrollments').get();
    const pendingPayments = await window.fb.getPendingPayments();
    const totalRevenue = await window.fb.getTotalRevenue();

    document.getElementById('stat-total-courses').textContent = courses.length;
    document.getElementById('stat-total-users').textContent = users.length;
    document.getElementById('stat-total-enrollments').textContent = enrollmentsSnapshot.size;
    document.getElementById('stat-published-courses').textContent = courses.filter(c => c.published).length;
    if (document.getElementById('stat-pending-payments')) {
      document.getElementById('stat-pending-payments').textContent = pendingPayments.length;
    }
    if (document.getElementById('stat-total-revenue')) {
      document.getElementById('stat-total-revenue').textContent = `Bs ${totalRevenue}`;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Courses
async function loadCourses() {
  try {
    allCourses = await window.fb.getCourses(false);
    renderCoursesTable(allCourses);
  } catch (error) {
    console.error('Error loading courses:', error);
    document.getElementById('coursesTableBody').innerHTML =
      '<tr><td colspan="6" class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar cursos</p></td></tr>';
  }
}

function renderCoursesTable(courses) {
  const tbody = document.getElementById('coursesTableBody');
  if (courses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><i class="fas fa-book"></i><p>No hay cursos aún</p></td></tr>';
    return;
  }
  tbody.innerHTML = courses.map(course => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${course.image || 'https://via.placeholder.com/60x40'}" alt="" style="width:60px;height:40px;border-radius:6px;object-fit:cover;">
          <div>
            <div style="font-weight:600;">${course.title}</div>
            <div style="font-size:0.8rem;color:var(--text-dim);">${course.instructorName || 'Sin instructor'}</div>
          </div>
        </div>
      </td>
      <td>${course.category}</td>
      <td>${course.priceBs === 0 ? 'Gratis' : 'Bs ' + course.priceBs}</td>
      <td>
        <button class="action-btn" title="Ver inscritos" onclick="viewEnrollments('${course.id}', '${course.title.replace(/'/g, "\\'")}')" style="color:var(--accent);font-weight:600;cursor:pointer;background:none;border:none;padding:4px 8px;">
          <i class="fas fa-users"></i> ${course.students || 0}
        </button>
      </td>
      <td><span class="badge ${course.published ? 'badge-active' : 'badge-draft'}">${course.published ? 'Publicado' : 'Borrador'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn" title="Editar" onclick="editCourse('${course.id}')"><i class="fas fa-edit"></i></button>
          <button class="action-btn danger" title="Eliminar" onclick="deleteCourse('${course.id}', '${course.title.replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Search courses
document.getElementById('courseSearch').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allCourses.filter(c =>
    c.title.toLowerCase().includes(term) ||
    c.category.toLowerCase().includes(term) ||
    (c.instructorName || '').toLowerCase().includes(term)
  );
  renderCoursesTable(filtered);
});

// Course Modal
const courseModal = document.getElementById('courseModal');
const addCourseBtn = document.getElementById('addCourseBtn');
const closeModal = document.getElementById('closeModal');
const cancelModal = document.getElementById('cancelModal');
const courseForm = document.getElementById('courseForm');
const modulesEditor = document.getElementById('modulesEditor');
const addModuleBtn = document.getElementById('addModuleBtn');

addCourseBtn.addEventListener('click', () => {
  document.getElementById('modalTitle').textContent = 'Nuevo Curso';
  document.getElementById('courseId').value = '';
  courseForm.reset();
  document.getElementById('cf-published').checked = true;
  modulesEditor.innerHTML = '';
  courseModal.classList.add('active');
});

closeModal.addEventListener('click', () => courseModal.classList.remove('active'));
cancelModal.addEventListener('click', () => courseModal.classList.remove('active'));
courseModal.addEventListener('click', (e) => { if (e.target === courseModal) courseModal.classList.remove('active'); });

// Modules editor
addModuleBtn.addEventListener('click', () => addModule());

function addModule(data = null) {
  const moduleIndex = modulesEditor.children.length;
  const moduleDiv = document.createElement('div');
  moduleDiv.className = 'module-item';
  moduleDiv.innerHTML = `
    <div class="module-item-header">
      <input type="text" class="module-title" placeholder="Título del módulo" value="${data?.title || ''}">
      <button type="button" class="action-btn danger" onclick="this.closest('.module-item').remove()"><i class="fas fa-trash"></i></button>
    </div>
    <div class="module-lessons"></div>
    <button type="button" class="add-lesson-btn" onclick="addLesson(this)"><i class="fas fa-plus"></i> Agregar Lección</button>
  `;
  modulesEditor.appendChild(moduleDiv);

  if (data?.lessons) {
    data.lessons.forEach(lesson => addLesson(moduleDiv.querySelector('.add-lesson-btn'), lesson));
  }
}

function addLesson(btn, data = null) {
  const lessonsDiv = btn.previousElementSibling;
  const lessonDiv = document.createElement('div');
  lessonDiv.className = 'lesson-item';
  lessonDiv.innerHTML = `
    <input type="text" class="lesson-title" placeholder="Título de lección" value="${data?.title || ''}">
    <input type="text" class="lesson-duration" placeholder="Duración" value="${data?.duration || ''}" style="max-width:100px;">
    <input type="url" class="lesson-video" placeholder="URL video (opcional)" value="${data?.videoUrl || ''}" style="max-width:200px;">
    <button type="button" class="action-btn danger" onclick="this.closest('.lesson-item').remove()" style="flex-shrink:0;"><i class="fas fa-times"></i></button>
  `;
  lessonsDiv.appendChild(lessonDiv);
}

// Form submit
courseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const courseId = document.getElementById('courseId').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
  submitBtn.disabled = true;

  const moduleElements = modulesEditor.querySelectorAll('.module-item');
  const modules = Array.from(moduleElements).map(mod => ({
    title: mod.querySelector('.module-title').value,
    lessons: Array.from(mod.querySelectorAll('.lesson-item')).map(lesson => ({
      title: lesson.querySelector('.lesson-title').value,
      duration: lesson.querySelector('.lesson-duration').value,
      videoUrl: lesson.querySelector('.lesson-video').value,
      type: 'video'
    }))
  }));

  const courseData = {
    title: document.getElementById('cf-title').value,
    slug: document.getElementById('cf-title').value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: document.getElementById('cf-category').value,
    badge: document.getElementById('cf-badge').value,
    description: document.getElementById('cf-description').value,
    longDescription: document.getElementById('cf-longDescription').value,
    image: document.getElementById('cf-image').value,
    duration: document.getElementById('cf-duration').value,
    priceBs: parseFloat(document.getElementById('cf-priceBs').value) || 0,
    priceUsd: parseFloat(document.getElementById('cf-priceUsd').value) || 0,
    originalPriceBs: parseFloat(document.getElementById('cf-priceBs').value) || 0,
    level: document.getElementById('cf-level').value,
    instructorName: document.getElementById('cf-instructorName').value,
    instructorTitle: document.getElementById('cf-instructorTitle').value,
    published: document.getElementById('cf-published').checked,
    modules: modules,
    included: [],
    requirements: { prerequisites: [], tools: [] }
  };

  try {
    if (courseId) {
      await window.fb.updateCourse(courseId, courseData);
    } else {
      courseData.students = 0;
      courseData.rating = 0;
      courseData.reviews = 0;
      await window.fb.createCourse(courseData);
    }
    courseModal.classList.remove('active');
    await loadCourses();
    await loadDashboardStats();
  } catch (error) {
    console.error('Error saving course:', error);
    alert('Error al guardar el curso');
  }

  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
});

// Edit course
window.editCourse = async function(courseId) {
  const course = allCourses.find(c => c.id === courseId);
  if (!course) return;

  document.getElementById('modalTitle').textContent = 'Editar Curso';
  document.getElementById('courseId').value = courseId;
  document.getElementById('cf-title').value = course.title || '';
  document.getElementById('cf-category').value = course.category || 'Blockchain';
  document.getElementById('cf-badge').value = course.badge || '';
  document.getElementById('cf-description').value = course.description || '';
  document.getElementById('cf-longDescription').value = course.longDescription || '';
  document.getElementById('cf-image').value = course.image || '';
  document.getElementById('cf-duration').value = course.duration || '';
  document.getElementById('cf-priceBs').value = course.priceBs || 0;
  document.getElementById('cf-priceUsd').value = course.priceUsd || 0;
  document.getElementById('cf-level').value = course.level || 'Intermedio';
  document.getElementById('cf-instructorName').value = course.instructorName || '';
  document.getElementById('cf-instructorTitle').value = course.instructorTitle || '';
  document.getElementById('cf-published').checked = course.published !== false;

  modulesEditor.innerHTML = '';
  if (course.modules) {
    course.modules.forEach(mod => addModule(mod));
  }

  courseModal.classList.add('active');
};

// Delete course
window.deleteCourse = async function(courseId, title) {
  if (!confirm(`¿Estás seguro de eliminar "${title}"?`)) return;
  try {
    await window.fb.deleteCourse(courseId);
    await loadCourses();
    await loadDashboardStats();
  } catch (error) {
    console.error('Error deleting course:', error);
    alert('Error al eliminar el curso');
  }
};

// Users
async function loadUsers() {
  try {
    allUsers = await window.fb.getAllUsers();
    renderUsersTable(allUsers);
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><i class="fas fa-users"></i><p>No hay usuarios aún</p></td></tr>';
    return;
  }
  tbody.innerHTML = users.map(user => {
    const name = user.name || 'Sin nombre';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const role = user.role || 'student';
    const date = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('es-BO') : 'N/A';
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--gradient);display:flex;align-items:center;justify-content:center;font-weight:700;color:#000;font-size:0.85rem;">${initials}</div>
            <span style="font-weight:500;">${name}</span>
          </div>
        </td>
        <td>${user.email || 'N/A'}</td>
        <td><span class="badge badge-${role}">${role === 'admin' ? 'Admin' : role === 'instructor' ? 'Instructor' : 'Estudiante'}</span></td>
        <td>${date}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn" title="Cambiar rol" onclick="openRoleModal('${user.id}', '${role}')"><i class="fas fa-user-shield"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Search users
document.getElementById('userSearch').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allUsers.filter(u =>
    (u.name || '').toLowerCase().includes(term) ||
    (u.email || '').toLowerCase().includes(term) ||
    (u.role || '').toLowerCase().includes(term)
  );
  renderUsersTable(filtered);
});

// Role modal
const roleModal = document.getElementById('roleModal');
document.getElementById('closeRoleModal').addEventListener('click', () => roleModal.classList.remove('active'));
document.getElementById('cancelRoleBtn').addEventListener('click', () => roleModal.classList.remove('active'));
roleModal.addEventListener('click', (e) => { if (e.target === roleModal) roleModal.classList.remove('active'); });

window.openRoleModal = function(userId, currentRole) {
  document.getElementById('roleUserId').value = userId;
  document.getElementById('newRole').value = currentRole;
  roleModal.classList.add('active');
};

document.getElementById('saveRoleBtn').addEventListener('click', async () => {
  const userId = document.getElementById('roleUserId').value;
  const newRole = document.getElementById('newRole').value;
  try {
    await window.fb.updateUserRole(userId, newRole);
    roleModal.classList.remove('active');
    await loadUsers();
  } catch (error) {
    console.error('Error updating role:', error);
    alert('Error al actualizar el rol');
  }
});

// ============ PAYMENTS ============

async function loadPayments() {
  try {
    const [allPayments, monthlyData] = await Promise.all([
      window.fb.getAllPayments(),
      window.fb.getPaymentsByMonth()
    ]);
    const pendingPayments = allPayments.filter(p => p.status === 'pending');

    // Render monthly summary
    const summaryEl = document.getElementById('monthlySummary');
    if (monthlyData.length > 0) {
      summaryEl.innerHTML = monthlyData.map(m => `
        <div class="monthly-card">
          <span class="month">${m.label}</span>
          <span class="amount">Bs ${m.total}</span>
          <span class="count">${m.count} pago(s) confirmado(s)</span>
        </div>
      `).join('');
    } else {
      summaryEl.innerHTML = '';
    }

    renderPaymentsTable(allPayments);
    document.getElementById('stat-pending-payments').textContent = pendingPayments.length;
  } catch (error) {
    console.error('Error loading payments:', error);
    document.getElementById('paymentsTableBody').innerHTML =
      '<tr><td colspan="6" class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar pagos</p></td></tr>';
  }
}

function renderPaymentsTable(payments) {
  const tbody = document.getElementById('paymentsTableBody');
  if (payments.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><i class="fas fa-check-circle"></i><p>No hay pagos registrados</p></td></tr>';
    return;
  }
  tbody.innerHTML = payments.map(p => {
    const date = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString('es-BO') : 'N/A';
    const userName = p.userName || p.userEmail || 'Usuario';
    const statusClass = p.status === 'confirmed' ? 'badge-confirmed' : p.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
    const statusText = p.status === 'confirmed' ? 'Confirmado' : p.status === 'rejected' ? 'Rechazado' : 'Pendiente';
    const actions = p.status === 'pending' ? `
      <div class="action-btns">
        <button class="action-btn" title="Confirmar" onclick="confirmPayment('${p.id}')" style="color:#22c55e;"><i class="fas fa-check"></i></button>
        <button class="action-btn danger" title="Rechazar" onclick="rejectPayment('${p.id}')"><i class="fas fa-times"></i></button>
      </div>` : `<span style="color:var(--text-dim);font-size:0.8rem;">${p.status === 'confirmed' ? 'Aprobado' : 'Rechazado'}</span>`;
    return `
      <tr>
        <td>${userName}</td>
        <td>${p.courseTitle || 'Curso'}</td>
        <td><strong>Bs ${p.amount || 0}</strong></td>
        <td>${date}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>${actions}</td>
      </tr>
    `;
  }).join('');
}

window.confirmPayment = async function(paymentId) {
  if (!confirm('¿Confirmar este pago e inscribir al usuario?')) return;
  try {
    await window.fb.confirmPayment(paymentId);
    alert('Pago confirmado. Usuario inscrito exitosamente.');
    await loadPayments();
    await loadDashboardStats();
  } catch (error) {
    console.error('Error confirming payment:', error);
    alert('Error al confirmar el pago');
  }
};

window.rejectPayment = async function(paymentId) {
  if (!confirm('¿Rechazar este pago?')) return;
  try {
    await window.fb.rejectPayment(paymentId);
    alert('Pago rechazado.');
    await loadPayments();
  } catch (error) {
    console.error('Error rejecting payment:', error);
    alert('Error al rechazar el pago');
  }
};

// ============ ENROLLMENTS VIEWER ============

window.viewEnrollments = async function(courseId, courseTitle) {
  const modal = document.getElementById('enrollmentsModal');
  const list = document.getElementById('enrollmentsList');
  const title = document.getElementById('enrollmentsModalTitle');

  title.textContent = `Inscritos: ${courseTitle}`;
  list.innerHTML = '<p style="text-align:center;color:var(--text-dim);"><i class="fas fa-spinner fa-spin"></i> Cargando...</p>';
  modal.classList.add('active');

  try {
    const enrollments = await window.fb.getEnrollmentsByCourse(courseId);
    if (enrollments.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:var(--text-dim);padding:2rem;">No hay inscritos en este curso</p>';
      return;
    }
    list.innerHTML = `
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid var(--glass-border);">
            <th style="text-align:left;padding:8px;color:var(--text-dim);font-size:0.85rem;">Nombre</th>
            <th style="text-align:left;padding:8px;color:var(--text-dim);font-size:0.85rem;">Email</th>
            <th style="text-align:left;padding:8px;color:var(--text-dim);font-size:0.85rem;">Progreso</th>
            <th style="text-align:left;padding:8px;color:var(--text-dim);font-size:0.85rem;">Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${enrollments.map(e => {
            const date = e.enrolledAt ? new Date(e.enrolledAt.seconds * 1000).toLocaleDateString('es-BO') : 'N/A';
            const progress = e.progress || 0;
            return `
              <tr style="border-bottom:1px solid var(--glass-border);">
                <td style="padding:10px 8px;font-weight:500;">${e.userName}</td>
                <td style="padding:10px 8px;color:var(--text-dim);font-size:0.9rem;">${e.userEmail}</td>
                <td style="padding:10px 8px;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div style="flex:1;height:6px;background:var(--glass);border-radius:3px;overflow:hidden;">
                      <div style="height:100%;width:${progress}%;background:var(--accent);border-radius:3px;"></div>
                    </div>
                    <span style="font-size:0.8rem;color:var(--text-dim);">${progress}%</span>
                  </div>
                </td>
                <td style="padding:10px 8px;font-size:0.85rem;color:var(--text-dim);">${date}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
      <p style="margin-top:1rem;font-size:0.85rem;color:var(--text-dim);text-align:right;">Total: ${enrollments.length} inscrito(s)</p>
    `;
  } catch (error) {
    console.error('Error loading enrollments:', error);
    list.innerHTML = '<p style="text-align:center;color:#ef4444;padding:2rem;">Error al cargar inscritos</p>';
  }
};

// Close enrollments modal
document.getElementById('closeEnrollmentsModal').addEventListener('click', () => {
  document.getElementById('enrollmentsModal').classList.remove('active');
});
document.getElementById('enrollmentsModal').addEventListener('click', (e) => {
  if (e.target.id === 'enrollmentsModal') {
    document.getElementById('enrollmentsModal').classList.remove('active');
  }
});

// Load payments when panel is activated
document.querySelector('[data-panel="payments"]').addEventListener('click', () => {
  loadPayments();
});

// ============ SALE CONFIG ============

let saleCountdownInterval = null;

document.querySelector('[data-panel="sale"]').addEventListener('click', () => {
  loadSaleConfig();
});

async function loadSaleConfig() {
  try {
    const config = await window.fb.getSaleConfig();
    const statusEl = document.getElementById('saleStatus');
    const activeEl = document.getElementById('saleActive');
    const endTimeEl = document.getElementById('saleEndTime');
    const priceEl = document.getElementById('salePrice');
    const countdownEl = document.getElementById('saleCountdown');

    activeEl.checked = config.active || false;
    priceEl.value = config.salePrice || 99;

    if (config.endTime) {
      const endDate = config.endTime.toDate ? config.endTime.toDate() : new Date(config.endTime);
      const localISO = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      endTimeEl.value = localISO;
    }

    // Update status indicator
    if (config.active && config.endTime) {
      const endDate = config.endTime.toDate ? config.endTime.toDate() : new Date(config.endTime);
      const now = new Date();
      if (endDate > now) {
        statusEl.className = 'sale-status active';
        statusEl.querySelector('span').textContent = 'Oferta ACTIVA';
        startSaleCountdown(endDate, countdownEl);
      } else {
        statusEl.className = 'sale-status inactive';
        statusEl.querySelector('span').textContent = 'Oferta expirada';
        countdownEl.innerHTML = '';
      }
    } else {
      statusEl.className = 'sale-status inactive';
      statusEl.querySelector('span').textContent = 'Oferta inactiva';
      countdownEl.innerHTML = '';
    }
  } catch (error) {
    console.error('Error loading sale config:', error);
  }
}

function startSaleCountdown(endDate, container) {
  if (saleCountdownInterval) clearInterval(saleCountdownInterval);

  function update() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) {
      clearInterval(saleCountdownInterval);
      container.innerHTML = '<p class="countdown-text">La oferta ha expirado</p>';
      document.getElementById('saleStatus').className = 'sale-status inactive';
      document.getElementById('saleStatus').querySelector('span').textContent = 'Oferta expirada';
      return;
    }
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    container.innerHTML = `
      <p class="countdown-text">La oferta termina en:</p>
      <div class="countdown">
        <div class="countdown-unit"><span class="value">${String(hours).padStart(2, '0')}</span><span class="label">hs</span></div>
        <div class="countdown-unit"><span class="value">${String(minutes).padStart(2, '0')}</span><span class="label">min</span></div>
        <div class="countdown-unit"><span class="value">${String(seconds).padStart(2, '0')}</span><span class="label">seg</span></div>
      </div>`;
  }

  update();
  saleCountdownInterval = setInterval(update, 1000);
}

document.getElementById('saleForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const active = document.getElementById('saleActive').checked;
  const endTimeStr = document.getElementById('saleEndTime').value;
  const salePrice = parseInt(document.getElementById('salePrice').value) || 99;

  if (active && !endTimeStr) {
    alert('Debes especificar una fecha y hora de fin para la oferta.');
    return;
  }

  let endTime = null;
  if (endTimeStr) {
    endTime = new Date(endTimeStr);
  }

  try {
    await window.fb.setSaleConfig({
      active,
      endTime: endTime ? endTime.toISOString() : null,
      salePrice
    });
    alert('Configuración de oferta guardada.');
    await loadSaleConfig();
  } catch (error) {
    console.error('Error saving sale config:', error);
    alert('Error al guardar. Verifica que Firestore tenga permisos de escritura en la colección "config/sale".\n\nDetalle: ' + (error.message || error));
  }
});
