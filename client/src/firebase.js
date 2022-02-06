// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAq3yZvsf9xf7yLsZRZTzD7nLdcXQpyjJU',
  authDomain: 'graphqlreactnode-8d43d.firebaseapp.com',
  projectId: 'graphqlreactnode-8d43d',
  storageBucket: 'graphqlreactnode-8d43d.appspot.com',
  // messagingSenderId: '872219998558',
  appId: '1:872219998558:web:5ba60b70152e04f7e5f7cf',
  // measurementId: 'G-116RFEZZJV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const googleAuthProvider = new GoogleAuthProvider();

export default {
  auth,
  googleAuthProvider,
};
