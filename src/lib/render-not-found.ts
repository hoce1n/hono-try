import { themeDefinitions } from "../config/themes.js";

export function renderNotFoundPage(): string {
  const theme = themeDefinitions.pink;
  const themeStyle = Object.entries(theme.cssVariables)
    .map(([property, value]) => `${property}: ${value};`)
    .join(" ");

  return `
    <!DOCTYPE html>
    <html lang="en" data-theme="pink" style="color-scheme: ${theme.colorScheme}; ${themeStyle}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap">
        <link rel="stylesheet" href="/styles.css">
        <title>Page not found</title>
      </head>
      <body>
        <a class="skip-link" href="#mainContent">Skip to content</a>
        <main class="container error-container" id="mainContent" aria-labelledby="errorHeading">
          <p class="error-code" aria-hidden="true">404</p>
          <h1 id="errorHeading">This card could not be found.</h1>
          <p class="error-message">The link may be incomplete, expired, or no longer available.</p>
          <a class="error-action" href="/">Open the default card</a>
        </main>
      </body>
    </html>
  `;
}
