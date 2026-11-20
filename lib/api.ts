import { Demographics } from "@/types/demographics";

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

export async function analyzeImage(base64: string): Promise<Demographics> {
  const res = await fetch(`${API_URL}/skinstricPhaseTwo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 }),
  });
  const json = await res.json();
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Could not analyze the image");
  }
  return json.data;
}
