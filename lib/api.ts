const API_URL = "https://us-central1-frontend-simplified.cloudfunctions.net";

export async function submitUser(name: string, location: string) {
  const res = await fetch(`${API_URL}/skinstricPhaseOne`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, location }),
  });
  if (!res.ok) {
    throw new Error("Could not save your details");
  }
  return res.json();
}
