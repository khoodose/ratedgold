var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  provider: {type: mongoose.Schema.Types.ObjectId, ref: 'Provider'}
});

ReviewSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
}

mongoose.model('Review', ReviewSchema);
