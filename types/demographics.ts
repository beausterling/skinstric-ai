export type Scores = Record<string, number>;

export type Demographics = {
  race: Scores;
  age: Scores;
  gender: Scores;
};

export type Category = keyof Demographics;

export type Choices = Record<Category, string>;

function isScores(value: unknown): value is Scores {
  if (!value || typeof value !== "object") return false;
  const scores = Object.values(value);
  return scores.length > 0 && scores.every((score) => Number.isFinite(score));
}

// checks that the data from the API or from local storage has everything the pages need
export function isDemographics(value: unknown): value is Demographics {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return isScores(data.race) && isScores(data.age) && isScores(data.gender);
}
