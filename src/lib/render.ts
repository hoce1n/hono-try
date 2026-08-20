import { cardExperience } from "../config/experience.js";
import type { Card } from "../types/card.js";
import { escapeHtml } from "./escape.js";

export function renderPage(card: Card): string {
  const experience = JSON.stringify(cardExperience);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/styles.css">
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

        <script>
          (() => {
            const noButton = document.getElementById("noBtn");
            const yesButton = document.getElementById("yesBtn");
            const cardContent = document.getElementById("cardContent");
            const successMessage = document.getElementById("successMsg");
            const experience = ${experience};

            if (!noButton || !yesButton || !cardContent || !successMessage) {
              return;
            }

            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
            let attemptCount = 0;
            let pointerFrame = 0;
            let pendingPointer = null;

            function clamp(value, minimum, maximum) {
              return Math.min(Math.max(value, minimum), maximum);
            }

            function moveNoButton(targetX, targetY) {
              const rect = noButton.getBoundingClientRect();
              const padding = experience.noButton.viewportPadding;
              const maximumX = Math.max(padding, window.innerWidth - rect.width - padding);
              const maximumY = Math.max(padding, window.innerHeight - rect.height - padding);
              const left = clamp(targetX, padding, maximumX);
              const top = clamp(targetY, padding, maximumY);

              if (!noButton.classList.contains("is-floating")) {
                noButton.classList.add("is-floating");
                noButton.style.left = rect.left + "px";
                noButton.style.top = rect.top + "px";
              }

              requestAnimationFrame(() => {
                noButton.style.left = left + "px";
                noButton.style.top = top + "px";
              });
            }

            function shrinkNoButton() {
              attemptCount += 1;
              const scale = Math.max(
                experience.noButton.minimumScale,
                1 - attemptCount * experience.noButton.shrinkStep,
              );
              noButton.style.setProperty("--no-button-scale", String(scale));
              noButton.classList.add("is-shrinking");
            }

            function dodgePointer(pointerX, pointerY) {
              const rect = noButton.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              const distanceX = centerX - pointerX;
              const distanceY = centerY - pointerY;
              const distance = Math.hypot(distanceX, distanceY);

              if (distance >= experience.noButton.proximityDistance) {
                return;
              }

              const angle = distance === 0
                ? Math.random() * Math.PI * 2
                : Math.atan2(distanceY, distanceX);
              const targetX = rect.left + Math.cos(angle) * experience.noButton.escapeDistance;
              const targetY = rect.top + Math.sin(angle) * experience.noButton.escapeDistance;

              shrinkNoButton();
              moveNoButton(targetX, targetY);
            }

            function teleportNoButton() {
              const rect = noButton.getBoundingClientRect();
              const padding = experience.noButton.viewportPadding;
              const targetX = padding + Math.random() * Math.max(0, window.innerWidth - rect.width - padding * 2);
              const targetY = padding + Math.random() * Math.max(0, window.innerHeight - rect.height - padding * 2);

              shrinkNoButton();
              moveNoButton(targetX, targetY);
            }

            function handlePointerMove(event) {
              pendingPointer = { x: event.clientX, y: event.clientY };

              if (pointerFrame) {
                return;
              }

              pointerFrame = requestAnimationFrame(() => {
                pointerFrame = 0;
                if (pendingPointer) {
                  dodgePointer(pendingPointer.x, pendingPointer.y);
                }
              });
            }

            if (hasFinePointer && !prefersReducedMotion) {
              document.addEventListener("pointermove", handlePointerMove, { passive: true });
              noButton.addEventListener("pointerenter", (event) => {
                dodgePointer(event.clientX, event.clientY);
              });
            }

            noButton.addEventListener("click", (event) => {
              event.preventDefault();

              if (!prefersReducedMotion && hasFinePointer) {
                teleportNoButton();
              }
            });

            yesButton.addEventListener("click", () => {
              cardContent.hidden = true;
              successMessage.hidden = false;
              successMessage.focus();

              if (!prefersReducedMotion) {
                createConfetti();
              }
            });

            function createConfetti() {
              const layer = document.createElement("div");
              layer.className = "confetti-layer";
              layer.setAttribute("aria-hidden", "true");

              const fragment = document.createDocumentFragment();
              for (let index = 0; index < experience.confetti.count; index += 1) {
                const piece = document.createElement("span");
                const size = experience.confetti.particleSize.minimum + Math.random()
                  * (experience.confetti.particleSize.maximum - experience.confetti.particleSize.minimum);
                const duration = experience.confetti.durationMs * (0.7 + Math.random() * 0.6);

                piece.className = "confetti-piece";
                piece.style.backgroundColor = experience.confetti.colors[
                  Math.floor(Math.random() * experience.confetti.colors.length)
                ];
                piece.style.setProperty("--confetti-x", Math.random() * 100 + "vw");
                piece.style.setProperty("--confetti-drift", (Math.random() - 0.5) * 260 + "px");
                piece.style.setProperty("--confetti-size", size + "px");
                piece.style.setProperty("--confetti-duration", duration + "ms");
                piece.style.setProperty("--confetti-delay", Math.random() * 180 + "ms");
                piece.style.setProperty("--confetti-rotation", 540 + Math.random() * 540 + "deg");
                fragment.appendChild(piece);
              }

              layer.appendChild(fragment);
              document.body.appendChild(layer);
              window.setTimeout(() => layer.remove(), experience.confetti.durationMs * 1.5 + 200);
            }
          })();
        </script>
      </body>
    </html>
  `;
}
