import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const registerUser = async (email, password, name) => {
  if (!auth) throw new Error("Firebase Auth is not initialized. Please check your configuration.");
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const loginUser = async (email, password) => {
  if (!auth) throw new Error("Firebase Auth is not initialized. Please check your configuration.");
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const logoutUser = async () => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const subscribeToAuthState = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Helper to translate Firebase errors into user-friendly messages
const handleAuthError = (error) => {
  let message = "An error occurred during authentication.";
  
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      message = "Invalid email or password.";
      break;
    case 'auth/email-already-in-use':
      message = "An account with this email already exists.";
      break;
    case 'auth/weak-password':
      message = "Password should be at least 6 characters.";
      break;
    case 'auth/invalid-email':
      message = "Please enter a valid email address.";
      break;
    case 'auth/network-request-failed':
      message = "Network error. Please check your internet connection.";
      break;
    default:
      if (error.message) {
        message = error.message;
      }
      break;
  }
  
  const formattedError = new Error(message);
  formattedError.code = error.code;
  return formattedError;
};
