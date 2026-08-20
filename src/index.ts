import { Hono } from 'hono'
import { renderPage } from './lib/render.js'
import { getCardById } from './config/cards.js'
import { defaultCard } from './config/defaults.js'
import type { Card } from './types/card.js'

const app = new Hono()

app.get('/', (c) => {
  const questionFromQuery = c.req.query('question');

  const card: Card = {
    ...defaultCard,
    question: questionFromQuery || defaultCard.question,
  };

  return c.html(renderPage(card));
});

app.get('/cards/:cardId', (c) => {
  const card = getCardById(c.req.param('cardId'));

  if (!card) {
    return c.notFound();
  }

  return c.html(renderPage(card));
});

export default app
