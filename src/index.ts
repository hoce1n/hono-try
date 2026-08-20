import { Hono } from 'hono'
import { renderPage } from './lib/render.js'
import { renderNotFoundPage } from './lib/render-not-found.js'
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

app.get('/create', (c) => c.html(renderCreatePage()));

app.get('/cards/custom', (c) => {
  const card = createCustomCard({
    question: c.req.query('question'),
    success: c.req.query('success'),
    yes: c.req.query('yes'),
    no: c.req.query('no'),
    theme: c.req.query('theme'),
  });
  const shareUrl = new URL(`/cards/custom?${createShareQuery(card)}`, c.req.url).toString();

  return c.html(renderPage(card, { shareUrl }));
});

app.get('/cards/:cardId', (c) => {
  const card = getCardById(c.req.param('cardId'));

  if (!card) {
    return c.notFound();
  }

  return c.html(renderPage(card));
});

app.notFound((c) => c.html(renderNotFoundPage(), 404));

export default app
