import { cardExperience } from "../config/experience.js";
import { resolveTheme, themeDefinitions } from "../config/themes.js";
import type { Card } from "../types/card.js";
import { escapeHtml } from "./escape.js";

function serializeClientConfig(config: unknown): string {
  return JSON.stringify(config).replace(/</g, "\\u003C");
}

export type RenderPageOptions = {
  shareUrl?: string;
};

export function renderPage(card: Card, options: RenderPageOptions = {}): string {
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
  const sharePanel = options.shareUrl
    ? `
          <section class="share-panel" aria-labelledby="shareCardHeading">
            <h2 id="shareCardHeading">Your shareable link</h2>
            <p>Copy this link to share your card.</p>
            <input aria-label="Shareable card link" type="url" readonly value="${escapeHtml(options.shareUrl)}">
          </section>`
    : "";

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
        <a class="skip-link" href="#mainContent">Skip to content</a>
        <main class="container" id="mainContent" aria-labelledby="question">
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
        </main>${sharePanel}
        <footer class="credits-footer" aria-label="Creator credits">
          <span>built by hocein</span>
          <span aria-hidden="true">·</span>
          <a href="https://github.com/hoce1n">GitHub</a>
          <a href="https://www.linkedin.com/in/hocein/">LinkedIn</a>
          <a href="https://instagram.com/hoce1n">Instagram</a>
          <a href="https://t.me/hoce1n">Telegram</a>
        </footer>
        <script id="cardExperienceConfig" type="application/json">${clientConfig}</script>
      </body>
    </html>
  `;
}
