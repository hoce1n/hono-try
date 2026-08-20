import { Hono } from 'hono'
import { renderPage } from './lib/render.js'
import { defaultCard } from './config/defaults.js'
import type { Card } from './types/card.js'

const app = new Hono()

app.get('/', (c) => {
  const questionFromQuery = c.req.query('question');

  const card: Card = {
    ...defaultCard,
    question: questionFromQuery || defaultCard.question
  }

  return c.html(renderPage(card));
})

export default app
