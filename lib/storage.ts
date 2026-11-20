import { Demographics } from "@/types/demographics";

const USER_KEY = "skinstric-user";
const DEMOGRAPHICS_KEY = "skinstric-demographics";

export function saveUser(name: string, location: string) {
  localStorage.setItem(USER_KEY, JSON.stringify({ name, location }));
}

export function saveDemographics(data: Demographics) {
  localStorage.setItem(DEMOGRAPHICS_KEY, JSON.stringify(data));
}

export function getDemographics(): Demographics | null {
  const saved = localStorage.getItem(DEMOGRAPHICS_KEY);
  return saved ? JSON.parse(saved) : null;
}
