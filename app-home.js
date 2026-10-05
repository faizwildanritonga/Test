import { getSessionUser, clearSession } from "./auth.js";

const username = getSessionUser();
if (!username) {
  window.location.href = "login.html";
} else {
  document.getElementById("salam").textContent = `Halo, ${username}! 👋`;
}

document.getElementById("btn-logout").addEventListener("click", () => {
  clearSession();
  window.location.href = "login.html";
});
