// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBIVcc8O2_0VBgnHNV-bjdWss2JlpyM21U',
  authDomain: 'location-d4c5d.firebaseapp.com',
  databaseURL: 'https://location-d4c5d-default-rtdb.firebaseio.com',
  projectId: 'location-d4c5d',
  storageBucket: 'location-d4c5d.appspot.com',
  messagingSenderId: '732511649667',
  appId: '1:732511649667:web:4ff55ad17e5f59214200b6',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
