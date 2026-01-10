import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase";

const AuthContext = createContext(null);

// Admin email
const ADMIN_EMAIL = "admin@alqtar.com";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Listen to auth state changes
  useEffect(() => {
    // Diagnostic check for production
    if (!import.meta.env.VITE_FIREBASE_API_KEY) {
      console.warn(
        "⚠️ Firebase API Key is missing. Check your environment variables!"
      );
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData({
              ...userDoc.data(),
              isAdmin: firebaseUser.email === ADMIN_EMAIL,
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Create user document in Firestore
  const createUserDocument = async (firebaseUser, additionalData = {}) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName || additionalData.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        createdAt: serverTimestamp(),
        isAdmin: firebaseUser.email === ADMIN_EMAIL,
        balance: firebaseUser.email === ADMIN_EMAIL ? 99999 : 500, // Sync with backend API
        subscription: {
          plan: firebaseUser.email === ADMIN_EMAIL ? "pro" : "free",
          credits: firebaseUser.email === ADMIN_EMAIL ? 99999 : 500,
          creditsResetDate: new Date(),
        },
        ...additionalData,
      };

      await setDoc(userRef, userData);
      setUserData(userData);
    } else {
      setUserData({
        ...userSnap.data(),
        isAdmin: firebaseUser.email === ADMIN_EMAIL,
      });
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(result.user, { displayName });

      // Create user document
      await createUserDocument(result.user, { displayName });

      return result.user;
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user);
      return result.user;
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      return result.user;
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  // Get Arabic error messages
  const getErrorMessage = (code) => {
    const errors = {
      "auth/email-already-in-use": "البريد الإلكتروني مستخدم بالفعل",
      "auth/invalid-email": "البريد الإلكتروني غير صالح",
      "auth/operation-not-allowed": "العملية غير مسموحة",
      "auth/weak-password": "كلمة المرور ضعيفة جداً",
      "auth/user-disabled": "تم تعطيل هذا الحساب",
      "auth/user-not-found": "لا يوجد حساب بهذا البريد الإلكتروني",
      "auth/wrong-password": "كلمة المرور غير صحيحة",
      "auth/too-many-requests": "محاولات كثيرة جداً. حاول لاحقاً",
      "auth/popup-closed-by-user": "تم إغلاق نافذة تسجيل الدخول",
      "auth/invalid-credential": "بيانات الاعتماد غير صحيحة",
    };
    return errors[code] || "حدث خطأ غير متوقع";
  };

  const value = {
    user,
    userData,
    loading,
    error,
    isAdmin,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
