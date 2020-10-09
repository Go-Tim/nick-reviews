const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const path = require('path');

const dbHelpers = require('../database/dbHelpers.js');

// Static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

// Get all reviews for particular campground by campId sorted by helpfulness and then date.
// Returns an array of reviews
app.get('reviews/helpful/:campId', (req, res) => {
  dbHelpers.getCampgroundReviews(req.params.campId, (err, reviews) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(reviews);
    }
  });
});
// Get all reviews for particular campground by campId sorted by date only.
// Returns an array of reviews
app.get('reviews/date/:campId', (req, res) => {
  dbHelpers.getCampgroundReviewsByDate(req.params.campId, (err, reviews) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(reviews);
    }
  });
});
// Increment or decrement the helpful count of a review
app.put('reviews/helpful', (req, res) => {
  dbHelpers.editReviewHelpful(req.body, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Helpfulness updated!');
    }
  });
});
// Post a review to the database for particular campground by campId.
app.post('reviews/:campId', (req, res) => {
  dbHelpers.postReviewByCampId(req.params.campId, req.body, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Thanks for your review!');
    }
  });
});

// Set port and get confirmation
let port = 3004;
app.listen(port, () => console.log(`Reviews server listening at port ${port}`));