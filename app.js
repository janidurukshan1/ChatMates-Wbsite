import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Wait until auth is ready
onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // SAFE access after auth loads
  const currentUser = user.email;

  document.getElementById("me").innerText = currentUser;

  // You can keep your chat logic below this safely
});

// Logout
window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error(error);
    });
};
