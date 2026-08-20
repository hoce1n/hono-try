import { cardExperience } from "../config/experience.js";
import { resolveTheme, themeDefinitions } from "../config/themes.js";
import type { Card } from "../types/card.js";
import { escapeHtml } from "./escape.js";

function serializeClientConfig(config: unknown): string {
  return JSON.stringify(config).replace(/</g, "\\u003C");
}

export function renderPage(card: Card): string {
  const theme = resolveTheme(card.theme);
  const themeDefinition = themeDefinitions[theme];
  const themeStyle = Object.entries(themeDefinition.cssVariables)
    .map(([property, value]) => `${property}: ${value};`)
    .join(" ");
  const clientConfig = serializeClientConfig({
    ...cardExperience,
    confetti: {
      ...cardExperience.confetti,
      colors: themeDefinition.confettiColors,
    },
  });

  return `
    <!DOCTYPE html>
    <html lang="en" data-theme="${theme}" style="color-scheme: ${themeDefinition.colorScheme}; ${themeStyle}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap">
        <link rel="stylesheet" href="/styles.css">
        <script src="/card.js" defer></script>
        <title>${escapeHtml(card.pageTitle)}</title>
      </head>
      <body>
        <main class="container" aria-labelledby="question">
          <section id="cardContent">
            <h1 id="question">${escapeHtml(card.question)}</h1>
            <div class="buttons" aria-label="${escapeHtml(card.responseOptionsLabel)}">
              <button id="yesBtn" type="button">${escapeHtml(card.yesLabel)}</button>
              <button id="noBtn" type="button">${escapeHtml(card.noLabel)}</button>
            </div>
          </section>
          <section class="success-message" id="successMsg" role="status" aria-live="polite" aria-atomic="true" tabindex="-1" hidden>
            ${escapeHtml(card.successMessage)}
          </section>
        </main>
        <script id="cardExperienceConfig" type="application/json">${clientConfig}</script>
      </body>
    </html>
  `;
}
