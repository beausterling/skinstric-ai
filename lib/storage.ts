import { Choices, Demographics, isDemographics } from "@/types/demographics";

const USER_KEY = "skinstric-user";
const DEMOGRAPHICS_KEY = "skinstric-demographics";
const CHOICES_KEY = "skinstric-choices";

// local storage can be blocked or hold broken data, so reading never throws
function read(key: string): unknown {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveUser(name: string, location: string) {
  localStorage.setItem(USER_KEY, JSON.stringify({ name, location }));
}

export function saveDemographics(data: Demographics) {
  localStorage.setItem(DEMOGRAPHICS_KEY, JSON.stringify(data));
  // the old corrections belong to the old photo
  localStorage.removeItem(CHOICES_KEY);
}

export function getDemographics(): Demographics | null {
  const saved = read(DEMOGRAPHICS_KEY);
  return isDemographics(saved) ? saved : null;
}

// the attributes the user confirmed on the demographics page
export function saveChoices(choices: Choices) {
  localStorage.setItem(CHOICES_KEY, JSON.stringify(choices));
}

export function getChoices(data: Demographics): Choices | null {
  const saved = read(CHOICES_KEY) as Choices | null;
  if (!saved || typeof saved !== "object") return null;
  // only use them if every choice is one of the scores of this analysis
  const valid = (["race", "age", "gender"] as const).every(
    (key) => typeof saved[key] === "string" && saved[key] in data[key],
  );
  return valid ? saved : null;
}
