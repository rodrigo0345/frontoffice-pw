// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwWQ2WuS1mWYpt2FctnQY9cc4OK1XSsUw",
  authDomain: "pw24-c5c9c.firebaseapp.com",
  projectId: "pw24-c5c9c",
  storageBucket: "pw24-c5c9c.appspot.com",
  messagingSenderId: "219742272214",
  appId: "1:219742272214:web:8dfe74f904de46ac7f6777",
  measurementId: "G-W3H8S9V2SC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);