// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithPopup, GoogleAuthProvider } from
 "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMH8cgvvZztzBQtIgqukGZKcGpVlTqVZY",
  authDomain: "sprint-2-ccac7.firebaseapp.com",
  projectId: "sprint-2-ccac7",
  storageBucket: "sprint-2-ccac7.appspot.com",
  messagingSenderId: "36260171092",
  appId: "1:36260171092:web:1668781306938b94af4cc1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const logInGoogle = async () => {
  const result = await signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    return {error:false,data:user};
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    return {error:true,data:error};
    // ...
  });
  return result;
}
  
export { logInGoogle };
