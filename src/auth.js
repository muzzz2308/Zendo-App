const USER_KEY = "user";
const AUTH_KEY = "isLoggedIn";

export function registerUser(email, password) {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ email, password })
  );
}

export function loginUser(email, password) {
  const user = JSON.parse(localStorage.getItem(USER_KEY));

  if (!user) return false;

  if (user.email === email && user.password === password) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === "true";
}
