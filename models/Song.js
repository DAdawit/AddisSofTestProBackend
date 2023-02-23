const mongoose = require("mongoose");

const SongSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  artist: {
    type: String,
    require: true,
  },
  songUrl: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Song = mongoose.model("Song", SongSchema);
module.exports = Song;
