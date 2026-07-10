# Liberland Academy

Centro de Desarrollo del Talento — Plataforma de cursos online con sistema de inscripción, pagos y gestión administrativa.

## Descripción

Liberland Academy es una plataforma web estática para la venta y gestión de cursos online enfocados en Blockchain, Seguridad Informática y Forense Digital. Diseñada para jóvenes bolivianos que quieren entrar al mundo tech.

**Demo:** [liberland.vercel.app](https://liberland.vercel.app)

## Funcionalidades

### Panel de Estudiante
- Registro e inicio de sesión (email/password y Google)
- Catálogo de cursos con búsqueda por categoría
- Compra de cursos con pago por QR (Tigo Money) y envío de comprobante por WhatsApp
- Dashboard con cursos inscritos, progreso y certificados
- Lista de deseos
- Historial de pagos

### Panel de Administrador
- Gestión de cursos (CRUD con módulos y lecciones)
- Gestión de usuarios y roles (admin, instructor, estudiante)
- Aprobación/rechazo de pagos con inscripción automática
- Resumen financiero mensual de ingresos
- Configuración de ofertas globales con countdown

### Sistema de Ofertas
- Oferta global configurable desde el admin (precio fijo 99 Bs)
- Countdown en tiempo real en landing page y página de curso
- Precio de oferta aplica automáticamente al comprar

### Certificados
- Generación automática al completar un curso (100% progreso)
- Descarga en formato HTML

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, CSS3 (glassmorphism), JavaScript vanilla |
| Backend/DB | Firebase (Firestore, Auth, Storage) |
| Hosting | Vercel |
| Pagos | Tigo Money (QR manual + WhatsApp) |

## Estructura del Proyecto

```
├── index.html          # Landing page (catálogo de cursos)
├── course.html         # Detalle de curso + compra
├── dashboard.html      # Panel del estudiante
├── admin.html          # Panel de administración
├── login.html          # Inicio de sesión
├── register.html       # Registro de cuenta
├── forgot-password.html # Recuperación de contraseña
├── terms.html          # Términos y condiciones
├── privacy.html        # Política de privacidad
├── refund.html         # Política de reembolsos
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   ├── firebase-config.js  # Configuración Firebase + helpers
│   ├── auth.js             # Gestión de autenticación
│   ├── admin.js            # Lógica del panel admin
│   ├── app.js              # Utilidades UI (navbar, notificaciones)
│   ├── particles.js        # Animación de partículas (hero)
│   └── seed.js             # Script para poblar Firestore con cursos
└── images/
    ├── Liberland_logo.png
    ├── QR_Liberland.jpeg
    └── MANUAL DE IDENTIDAD VISUAL (1).pdf
```

## Configuración

### Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita **Firestore Database**, **Authentication** (email/password + Google) y **Storage**
3. En Firestore, crea la colección `users` y configura las reglas de seguridad (ver abajo)
4. Actualiza las credenciales en `js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.firebasestorage.app",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### Firestore Rules

Copia estas reglas en Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /courses/{courseId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /payments/{paymentId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /wishlist/{docId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    match /config/{docId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Índices Compuestos

Crea los siguientes índices en Firestore Database → Índices:

| Colección | Campos | Dirección |
|-----------|--------|-----------|
| `payments` | `userId` + `status` | Ascending + Ascending |
| `payments` | `status` + `createdAt` | Ascending + Descending |
| `enrollments` | `userId` + `courseId` | Ascending + Ascending |
| `wishlist` | `userId` + `courseId` | Ascending + Ascending |

### Datos Iniciales

Para poblar Firestore con cursos de ejemplo, abre la consola del navegador en cualquier página del proyecto y ejecuta:

```javascript
seedFirestore()
```

## Seguridad

### Protecciones implementadas

- **Inscripciones**: Solo el admin puede crear inscripciones (Firestore rule). Las inscripciones pasan por el flujo de pago confirmado.
- **Cursos gratuitos**: Se crea un pago con `amount: 0` y `status: 'confirmed'` automáticamente, luego se genera la inscripción.
- **Funciones admin**: `confirmPayment`, `rejectPayment`, `createPayment` no están expuestas en `window.fb` — no se pueden ejecutar desde la consola del navegador.
- **Roles de usuario**: `admin`, `instructor`, `student` — verificados en Firestore rules y en el cliente.
- **Cursos públicos**: El catálogo y detalle de cursos son públicos (necesario para landing page), pero el contenido del curso (video/clases) requiere inscripción.

### Reglas de seguridad (resumen)

| Colección | Lectura | Escritura |
|-----------|---------|-----------|
| `users` | Propio usuario + admin | Propio usuario + admin |
| `courses` | Público | Solo admin |
| `enrollments` | Propio usuario + admin | Solo admin |
| `payments` | Propio usuario + admin | Crear: propio usuario / Update: solo admin |
| `wishlist` | Propio usuario | Propio usuario |
| `config` | Público | Solo admin |

## Deploy

### GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/ergonber/Liberland.git
git push -u origin main
```

### Vercel

1. Importa el repositorio desde GitHub
2. Framework: **Other** (HTML estático)
3. Deploy automático

## Licencia

Proyecto privado — Liberland Academy © 2026
