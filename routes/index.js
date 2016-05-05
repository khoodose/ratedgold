var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Provider = mongoose.model('Provider');
var Review = mongoose.model('Review');

// route for displaying all providers
router.get('/providers', function(req, res, next) {
  Provider.find(function(err, providers) {
    if (err) { next(err); }

    res.json(providers);
  })
});

// route for creating a new provider
router.post('/providers', function(req, res, next) {
  var provider = new Provider(req.body);

  provider.save(function(err, provider) {
    if (err) { return next(err); }
    res.json(provider);
  })
});

// get the Provider params
router.param('provider', function(req, res, next, id) {
  var query = Provider.findById(id);
  query.exec(function(err, provider) {
    if (err) { return next(err); }
    if(!provider) { return next(new Error("can't find provider")); }

    req.provider = provider;
    return next();
  })
});

// get the Review Params
router.param('review', function(req, res, next, id) {
  var query = Review.findById(id);
  query.exec(function(err, review) {
    if (err) { return next(err); }
    if(!review) { return next(new Error("can't find review")); }

    req.review = review;
    return next();
  })
});

// show a particular provider
router.get('/providers/:provider', function(req, res) {
  req.provider.populate('reviews', function(err, provider) {
      if (err) { return next(err); }

      res.json(provider);
    });
});

// delete a particular provider

router.delete('/providers/:provider', function(req, res) {
  req.provider.remove(function(err, provider) {
    if (err) { return next(err); }
    res.send("provider deleted");
  });
});

// delete a particular review

router.delete('/providers/:provider/reviews/:review', function(req, res) {
  req.review.remove(function(err, provider) {
    if (err) { return next(err); }
    res.send("review deleted");
  });
});

// upvote a provider
router.put('/providers/:provider/upvote', function(req, res, next) {
  req.provider.upvote(function(err, provider) {
    if (err) { return next(err); }

    res.json(provider);
  });
});

// upvote a review
router.put('/providers/:provider/reviews/:review/upvote', function(req, res, next) {
  req.review.upvote(function(err, review) {
    if (err) { return next(err); }

    res.json(review);
  });
});


// post a new review
router.post('/providers/:provider/reviews', function(req, res, next) {
  var review = new Review(req.body);
  review.provider = req.provider;

  review.save(function(err, review) {
    if (err) { return next(err); }

    req.provider.reviews.push(review);

    req.provider.save(function(err, provider) {
      if (err) { return next(err); }

      res.json(review);
    });
  });
});

module.exports = router;
