// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAV1PEYMk5_eHvrclSXfOxurD_ptfSygUw",
  authDomain: "liberland-academy.firebaseapp.com",
  projectId: "liberland-academy",
  storageBucket: "liberland-academy.firebasestorage.app",
  messagingSenderId: "773316289269",
  appId: "1:773316289269:web:ea5751d9812712a90adbbc"
};

// Initialize Firebase (compat SDK loaded via CDN in HTML)
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Export for use in other scripts
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage;
window.firebaseGoogleProvider = googleProvider;

// Firebase helpers
window.fb = {
  auth,
  db,
  storage,
  googleProvider,

  // Auth methods
  onAuthStateChanged: (cb) => auth.onAuthStateChanged(cb),
  signInWithEmailAndPassword: (email, password) => auth.signInWithEmailAndPassword(email, password),
  createUserWithEmailAndPassword: (email, password) => auth.createUserWithEmailAndPassword(email, password),
  signOut: () => auth.signOut(),
  sendPasswordResetEmail: (email) => auth.sendPasswordResetEmail(email),
  signInWithPopup: (provider) => auth.signInWithPopup(provider || googleProvider),

  // Firestore methods
  doc: (ref, ...path) => db.doc(path ? db.doc(ref).path + '/' + path.join('/') : ref),
  getDoc: (docRef) => docRef.get(),
  setDoc: (docRef, data) => docRef.set(data),
  collection: (name) => db.collection(name),
  getDocs: (queryOrCol) => queryOrCol.get(),
  query: (col, ...constraints) => {
    let q = col;
    constraints.forEach(c => q = q.where(c.field, c.op, c.value));
    return q;
  },
  where: (field, op, value) => ({ field, op, value }),
  updateDoc: (docRef, data) => docRef.update(data),
  deleteDoc: (docRef) => docRef.delete(),
  addDoc: (colRef, data) => colRef.add(data),
  serverTimestamp: () => firebase.firestore.FieldValue.serverTimestamp(),
  orderBy: (field, dir) => ({ field, dir }),

  // Storage methods
  ref: (path) => storage ? storage.ref(path) : null,
  uploadBytes: (ref, file) => ref ? ref.put(file) : null,
  getDownloadURL: (ref) => ref ? ref.getDownloadURL() : null,

  // Helper: Check if user is admin
  async isAdmin(uid) {
    const userDoc = await db.doc('users/' + uid).get();
    return userDoc.exists && userDoc.data().role === 'admin';
  },

  // Helper: Check if user is instructor or admin
  async isInstructorOrAdmin(uid) {
    const userDoc = await db.doc('users/' + uid).get();
    if (!userDoc.exists) return false;
    const role = userDoc.data().role;
    return role === 'admin' || role === 'instructor';
  },

  // Helper: Get user data
  async getUserData(uid) {
    const userDoc = await db.doc('users/' + uid).get();
    return userDoc.exists ? userDoc.data() : null;
  },

  // Helper: Create user document
  async createUserDoc(uid, data) {
    await db.doc('users/' + uid).set({
      ...data,
      role: 'student',
      enrolledCourses: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  // Helper: Get all courses
  async getCourses(publishedOnly = true) {
    let col = db.collection('courses');
    if (publishedOnly) {
      col = col.where('published', '==', true);
    }
    const snapshot = await col.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Helper: Get single course
  async getCourse(courseId) {
    const courseDoc = await db.doc('courses/' + courseId).get();
    return courseDoc.exists ? { id: courseDoc.id, ...courseDoc.data() } : null;
  },

  // Helper: Create course
  async createCourse(data) {
    return await db.collection('courses').add({
      ...data,
      students: 0,
      rating: 0,
      published: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  // Helper: Update course
  async updateCourse(courseId, data) {
    await db.doc('courses/' + courseId).update({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  // Helper: Delete course
  async deleteCourse(courseId) {
    await db.doc('courses/' + courseId).delete();
  },

  // Helper: Get user enrollments
  async getUserEnrollments(uid) {
    const snapshot = await db.collection('enrollments').where('userId', '==', uid).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Helper: Check if user is enrolled in a course
  async isEnrolled(uid, courseId) {
    const snapshot = await db.collection('enrollments')
      .where('userId', '==', uid)
      .where('courseId', '==', courseId)
      .get();
    return !snapshot.empty;
  },

  // Helper: Check if user has a pending payment for a course
  async hasPendingPayment(uid, courseId) {
    const snapshot = await db.collection('payments')
      .where('userId', '==', uid)
      .where('courseId', '==', courseId)
      .where('status', '==', 'pending')
      .get();
    return !snapshot.empty;
  },

  // Helper: Enroll in free course (creates confirmed payment + enrollment)
  async enrollFreeCourse(uid, courseId, courseTitle) {
    const paymentRef = await db.collection('payments').add({
      userId: uid,
      courseId: courseId,
      courseTitle: courseTitle,
      userName: '',
      userEmail: '',
      amount: 0,
      status: 'confirmed',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await db.collection('enrollments').add({
      userId: uid,
      courseId: courseId,
      progress: 0,
      enrolledAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastAccessed: firebase.firestore.FieldValue.serverTimestamp()
    });
    const courseRef = db.doc('courses/' + courseId);
    const courseDoc = await courseRef.get();
    if (courseDoc.exists) {
      await courseRef.update({ students: (courseDoc.data().students || 0) + 1 });
    }
    return paymentRef;
  },

  // Helper: Get user's pending payments
  async getUserPendingPayments(uid) {
    const snapshot = await db.collection('payments')
      .where('userId', '==', uid)
      .where('status', '==', 'pending')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Helper: Get all users (admin only)
  async getAllUsers() {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Helper: Update user role
  async updateUserRole(uid, role) {
    await db.doc('users/' + uid).update({ role });
  },

  // Helper: Upload image
  async uploadImage(file, path) {
    if (!storage) throw new Error('Firebase Storage no está configurado');
    const storageRef = storage.ref(path);
    await storageRef.put(file);
    return await storageRef.getDownloadURL();
  },

  // Helper: Create payment record
  async createPayment(data) {
    return await db.collection('payments').add({
      ...data,
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  // Helper: Get pending payments
  async getPendingPayments() {
    const snapshot = await db.collection('payments').where('status', '==', 'pending').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Helper: Get all payments
  async getAllPayments() {
    const snapshot = await db.collection('payments').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Helper: Confirm payment + enroll user
  async confirmPayment(paymentId) {
    const paymentDoc = await db.doc('payments/' + paymentId).get();
    if (!paymentDoc.exists) return;
    const payment = paymentDoc.data();
    await db.doc('payments/' + paymentId).update({ status: 'confirmed' });
    await db.collection('enrollments').add({
      userId: payment.userId,
      courseId: payment.courseId,
      progress: 0,
      enrolledAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastAccessed: firebase.firestore.FieldValue.serverTimestamp()
    });
    // Update course student count
    const courseRef = db.doc('courses/' + payment.courseId);
    const courseDoc = await courseRef.get();
    if (courseDoc.exists) {
      await courseRef.update({ students: (courseDoc.data().students || 0) + 1 });
    }
  },

  // Helper: Reject payment
  async rejectPayment(paymentId) {
    await db.doc('payments/' + paymentId).update({ status: 'rejected' });
  },

  // Helper: Get enrollments by courseId with user info
  async getEnrollmentsByCourse(courseId) {
    const snapshot = await db.collection('enrollments').where('courseId', '==', courseId).get();
    const enrollments = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userDoc = await db.doc('users/' + data.userId).get();
      const userData = userDoc.exists ? userDoc.data() : {};
      enrollments.push({
        id: doc.id,
        ...data,
        userName: userData.name || 'Sin nombre',
        userEmail: userData.email || 'Sin email'
      });
    }
    return enrollments;
  },

  // Helper: Get total revenue from confirmed payments
  async getTotalRevenue() {
    const snapshot = await db.collection('payments').where('status', '==', 'confirmed').get();
    return snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
  },

  // Helper: Get sale configuration
  async getSaleConfig() {
    try {
      const doc = await db.doc('config/sale').get();
      return doc.exists ? doc.data() : { active: false, endTime: null, salePrice: 99 };
    } catch (e) {
      console.warn('Error reading sale config:', e);
      return { active: false, endTime: null, salePrice: 99 };
    }
  },

  // Helper: Set sale configuration
  async setSaleConfig(data) {
    try {
      await db.doc('config/sale').set(data, { merge: true });
    } catch (e) {
      console.error('Error writing sale config:', e);
      throw e;
    }
  },

  // Helper: Get confirmed payments grouped by month
  async getPaymentsByMonth() {
    const snapshot = await db.collection('payments').where('status', '==', 'confirmed').get();
    const months = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (!data.createdAt) return;
      const date = data.createdAt.toDate();
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!months[key]) months[key] = { label, total: 0, count: 0 };
      months[key].total += data.amount || 0;
      months[key].count++;
    });
    return Object.values(months).sort((a, b) => b.label.localeCompare(a.label));
  }
};
