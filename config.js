import firebase from "firebase"
require("@firebase/firestore")

 var firebaseConfig = {
    apiKey: "AIzaSyDe5d3xjdIOoLWoh0VNZHAbWOzGgAasbLg",
    authDomain: "library-app-9d00d.firebaseapp.com",
    projectId: "library-app-9d00d",
    storageBucket: "library-app-9d00d.appspot.com",
    messagingSenderId: "449467881758",
    appId: "1:449467881758:web:1033367d77dbe90f63110f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
  