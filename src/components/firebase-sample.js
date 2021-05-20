import * as firebase from 'firebase';

// Your web app's Firebase configuration





// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  export { auth, db, storage }