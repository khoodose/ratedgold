var mongoose = require('mongoose');

var ProviderSchema = new mongoose.Schema({
  name: String,
  link: String,
  description: String,
  category: String,
  imageUrl: String,
  upvotes: {type: Number, default: 0},
  reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
});

ProviderSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
}

mongoose.model('Provider', ProviderSchema);
