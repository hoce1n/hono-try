export type Theme = "pink" | "purple" | "dark";

export type Card = {
  pageTitle: string;
  question: string;
  responseOptionsLabel: string;
  yesLabel: string;
  noLabel: string;
  successMessage: string;
  theme?: Theme;
};
