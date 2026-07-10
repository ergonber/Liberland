// Auth state management
window.AuthManager = {
  currentUser: null,
  userData: null,
  listeners: [],

  // Initialize auth state listener
  init() {
    if (!window.fb) {
      console.error('Firebase not initialized. Include firebase-config.js first.');
      return;
    }

    window.fb.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      if (user) {
        this.userData = await window.fb.getUserData(user.uid);
        if (!this.userData) {
          try {
            await window.fb.createUserDoc(user.uid, {
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              photoURL: user.photoURL || null
            });
            this.userData = await window.fb.getUserData(user.uid);
          } catch (e) {
            console.error('Error creando documento de usuario:', e);
          }
        }
      } else {
        this.userData = null;
      }
      this.notifyListeners();
    });
  },

  // Subscribe to auth changes
  onAuthChange(callback) {
    this.listeners.push(callback);
    if (this.currentUser !== null) {
      callback(this.currentUser, this.userData);
    }
  },

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUser, this.userData));
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  },

  // Check if user is admin
  isAdmin() {
    return this.userData?.role === 'admin';
  },

  // Check if user is instructor or admin
  isInstructorOrAdmin() {
    return this.userData?.role === 'admin' || this.userData?.role === 'instructor';
  },

  // Require authentication - redirect if not logged in
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // Require admin - redirect if not admin
  requireAdmin() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    if (!this.isAdmin()) {
      window.location.href = 'dashboard.html';
      return false;
    }
    return true;
  },

  // Require instructor or admin
  requireInstructor() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    if (!this.isInstructorOrAdmin()) {
      window.location.href = 'dashboard.html';
      return false;
    }
    return true;
  },

  // Get user display name
  getDisplayName() {
    if (this.userData?.name) return this.userData.name;
    if (this.currentUser?.displayName) return this.currentUser.displayName;
    if (this.currentUser?.email) return this.currentUser.email.split('@')[0];
    return 'Usuario';
  },

  // Get user initials
  getInitials() {
    const name = this.getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  // Sign out
  async logout() {
    await window.fb.signOut();
    window.location.href = 'login.html';
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  AuthManager.init();
});
