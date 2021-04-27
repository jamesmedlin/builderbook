const express = require('express');
const Book = require('../models/Book');
const Advertisement = require('../models/Advertisement');
const Purchase = require('../models/Purchase');
const { createSession } = require('../stripe');
const logger = require('../logger');

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
});

router.post('/stripe/fetch-checkout-session', async (req, res) => {
  try {
    const { bookId, redirectUrl } = req.body;

    const book = await Book.findById(bookId).select(['slug']).setOptions({ lean: true });

    if (!book) {
      throw new Error('Book not found');
    }

    const isPurchased =
      (await Purchase.find({ userId: req.user._id, bookId: book._id }).countDocuments()) > 0;
    if (isPurchased) {
      throw new Error('You already bought this book.');
    }

    const session = await createSession({
      userId: req.user._id.toString(),
      userEmail: req.user.email,
      bookId,
      bookSlug: book.slug,
      redirectUrl,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/my-advertisements', async (req, res) => {
  try {
    const { advertisements } = await Advertisement.getAdvertisements(req.user._id);

    advertisements.map((ad) => {
      // eslint-disable-next-line no-param-reassign
      ad.viewers = ad.viewers.length;
      return null;
    });
    res.json({ advertisements });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/my-advertisement/:slug', async (req, res) => {
  try {
    const { advertisements } = await Advertisement.getAdvertisements(req.user._id);

    advertisements.map((ad) => {
      // eslint-disable-next-line no-param-reassign
      ad.viewers = ad.viewers.length;
      return null;
    });
    res.json({ advertisements });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
