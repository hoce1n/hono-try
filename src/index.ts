import { Hono } from 'hono'

const app = new Hono()

// Default questions for scalability
const defaultQuestions = {
  date: "Do you want to go on a date with me? 💕",
  friend: "Will you be my friend? 👋",
  pizza: "Do you love pizza? 🍕",
  custom: (q: string) => q
}

// Route that serves the interactive page
app.get('/', (c) => {
  // Get query parameter for custom question
  const question = c.req.query('question') || defaultQuestions.date
  const theme = c.req.query('theme') || 'pink' // For future customization

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>A Question For You 💕</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Arial', sans-serif;
        }

        .container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 500px;
        }

        h1 {
          font-size: 28px;
          margin-bottom: 40px;
          color: #333;
          line-height: 1.6;
        }

        .buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        button {
          padding: 12px 30px;
          font-size: 16px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: bold;
        }

        #yesBtn {
          background-color: #4CAF50;
          color: white;
          padding: 15px 40px;
          font-size: 18px;
        }

        #yesBtn:hover {
          background-color: #45a049;
          transform: scale(1.1);
        }

        #noBtn {
          background-color: #f44336;
          color: white;
          position: relative;
        }

        #noBtn:hover {
          background-color: #da190b;
        }

        .success-message {
          display: none;
          font-size: 48px;
          animation: bounce 0.6s ease;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #ff69b4;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 id="question">${escapeHtml(question)}</h1>
        <div class="buttons">
          <button id="yesBtn">Yes 💚</button>
          <button id="noBtn">No</button>
        </div>
        <div class="success-message" id="successMsg">🎉 Yay! You said YES! 🎉</div>
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

  return c.html(html)
})

// Helper function to escape HTML (security)
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

export default app