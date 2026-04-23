<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDUvwNFqMNHO_REKwHt0uYL4xOG2TMK0BU",
    authDomain: "chatmates-e2c70.firebaseapp.com",
    projectId: "chatmates-e2c70",
    storageBucket: "chatmates-e2c70.firebasestorage.app",
    messagingSenderId: "822767312755",
    appId: "1:822767312755:web:9bf754e97657c1c992ef06",
    measurementId: "G-5D6539RR2K"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
