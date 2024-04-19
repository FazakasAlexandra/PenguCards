// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore, Firestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDlyt_QMASiihYn5B7LUtm-lHjkh0FwpAA',
  authDomain: 'pengucards-349ea.firebaseapp.com',
  projectId: 'pengucards-349ea',
  storageBucket: 'pengucards-349ea.appspot.com',
  messagingSenderId: '711971952885',
  appId: '1:711971952885:web:190ceaa89cb8e89b450dbc',
  measurementId: 'G-KKF2Y3B7YM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export default db;
