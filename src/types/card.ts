export type Theme = "pink" | "purple" | "dark";

export type Card = {
  question: string;
  successMessage: string;
  theme?: Theme;
  yesLabel?: string
  noLabel?: string;
}