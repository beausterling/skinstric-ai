const USER_KEY = "skinstric-user";

export function saveUser(name: string, location: string) {
  localStorage.setItem(USER_KEY, JSON.stringify({ name, location }));
}
