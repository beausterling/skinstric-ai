export type Scores = Record<string, number>;

export type Demographics = {
  race: Scores;
  age: Scores;
  gender: Scores;
};

export type Category = keyof Demographics;
