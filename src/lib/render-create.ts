export function renderCreatePage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en" data-theme="pink">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap">
        <link rel="stylesheet" href="/styles.css">
        <title>Create a card</title>
      </head>
      <body>
        <main class="container creator-container" aria-labelledby="createCardHeading">
          <a class="back-link" href="/">Back to the default card</a>
          <h1 id="createCardHeading">Create your card</h1>
          <p class="creator-intro">Choose the message, labels, and theme. Your finished card gets a shareable link without creating an account.</p>
          <form class="creator-form" action="/cards/custom" method="get">
            <label for="question">Question</label>
            <textarea id="question" name="question" maxlength="180" required>Do you want to go on a date with me? 💕</textarea>

            <label for="success">Success message</label>
            <textarea id="success" name="success" maxlength="180" required>🎉 Yay! You said YES! 🎉</textarea>

            <div class="creator-field-row">
              <div>
                <label for="yes">Yes button label</label>
                <input id="yes" name="yes" type="text" maxlength="40" value="YES" required>
              </div>
              <div>
                <label for="no">No button label</label>
                <input id="no" name="no" type="text" maxlength="40" value="NO" required>
              </div>
            </div>

            <label for="theme">Theme</label>
            <select id="theme" name="theme">
              <option value="pink">Pink</option>
              <option value="purple">Purple</option>
              <option value="dark">Dark</option>
            </select>

            <button class="creator-submit" type="submit">Create shareable card</button>
          </form>
        </main>
      </body>
    </html>
  `;
}
