// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCAZdlGKCfZn456GCv1YFlfwY9x5RkG9JI',
  authDomain: 'palces-9b45e.firebaseapp.com',
  projectId: 'palces-9b45e',
  storageBucket: 'palces-9b45e.appspot.com',
  messagingSenderId: '238001145456',
  appId: '1:238001145456:web:b2bbb9b0f7ef82d1a0d6b5',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
