import type { Card } from "../types/card.js";
import { escapeHtml } from "./escape.js";

export function renderPage(card: Card): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./styles.css">
        <title>A Question For You 💕</title>
        </head>
        <body>
        <div class="container">
            <h1 id="question">${escapeHtml(card.question)}</h1>
            <div class="buttons">
            <button id="yesBtn">${escapeHtml(card.yesLabel ?? "Yes 💚")}</button>
            <button id="noBtn">${escapeHtml(card.noLabel ?? "No")}</button>
            </div>
            <div class="success-message" id="successMsg">${escapeHtml(card.successMessage)}</div>
        </div>

        <script>
            const noBtn = document.getElementById('noBtn')
            const yesBtn = document.getElementById('yesBtn')
            const successMsg = document.getElementById('successMsg')
            const question = document.getElementById('question')

            // Behavior 1: No button runs away from cursor
            document.addEventListener('mousemove', (e) => {
            const rect = noBtn.getBoundingClientRect()
            const btnCenterX = rect.left + rect.width / 2
            const btnCenterY = rect.top + rect.height / 2

            const distX = e.clientX - btnCenterX
            const distY = e.clientY - btnCenterY
            const distance = Math.sqrt(distX * distX + distY * distY)

            if (distance < 150) { // Run away if cursor within 150px
                const angle = Math.atan2(distY, distX)
                const newX = btnCenterX - Math.cos(angle) * 150
                const newY = btnCenterY - Math.sin(angle) * 150

                noBtn.style.position = 'fixed'
                noBtn.style.left = newX + 'px'
                noBtn.style.top = newY + 'px'
            }
            })

            // Behavior 2: No button shrinks when hovered
            noBtn.addEventListener('mouseenter', () => {
            noBtn.style.transform = 'scale(0.5)'
            noBtn.style.opacity = '0.5'
            })

            noBtn.addEventListener('mouseleave', () => {
            noBtn.style.transform = 'scale(1)'
            noBtn.style.opacity = '1'
            })

            // Behavior 3: No button teleports on click attempt
            noBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const randomX = Math.random() * (window.innerWidth - 100)
            const randomY = Math.random() * (window.innerHeight - 50)
            noBtn.style.position = 'fixed'
            noBtn.style.left = randomX + 'px'
            noBtn.style.top = randomY + 'px'
            })

            // Yes button action
            yesBtn.addEventListener('click', () => {
            question.style.display = 'none'
            noBtn.style.display = 'none'
            yesBtn.style.display = 'none'
            successMsg.style.display = 'block'
            createConfetti()
            })

            // Fun confetti animation
            function createConfetti() {
            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div')
                confetti.className = 'confetti'
                confetti.style.left = Math.random() * window.innerWidth + 'px'
                confetti.style.top = '-10px'
                confetti.style.background = ['#ff69b4', '#ff1493', '#ff69b4', '#ffd700'][Math.floor(Math.random() * 4)]
                document.body.appendChild(confetti)

                let top = 0
                const speed = Math.random() * 5 + 3
                const drift = (Math.random() - 0.5) * 4

                const animate = () => {
                top += speed
                confetti.style.top = top + 'px'
                confetti.style.left = (parseFloat(confetti.style.left) + drift) + 'px'

                if (top < window.innerHeight) {
                    requestAnimationFrame(animate)
                } else {
                    confetti.remove()
                }
                }
                animate()
            }
            }
        </script>
        </body>
        </html>
  `
}