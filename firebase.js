import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUvwNFqMNHO_REKwHt0uYL4xOG2TMK0BU",
  authDomain: "chatmates-e2c70.firebaseapp.com",
  databaseURL: "https://console.firebase.google.com/project/chatmates-e2c70/database/chatmates-e2c70-default-rtdb/data/~2F?fb_gclid=CjwKCAjwhqfPBhBWEiwAZo196tmBuXrWxePhLiGiPCYG6XEqE4u5ikpzBa8oxYrrYbhS1nsyfi_4ORoCicwQAvD_BwE&fb_utm_campaign=Cloud-SS-DR-Firebase-FY26-global-gsem-1713590&fb_utm_content=text-ad&fb_utm_medium=cpc&fb_utm_source=google&fb_utm_term=KW_firebase%20console",
  projectId: "chatmates-e2c70"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
