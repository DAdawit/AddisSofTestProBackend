const multer = require("multer");
const Song = require("../models/Song");
const fs = require("fs");

let songUrl = "";

const Storage = multer.diskStorage({
  destination: "assets",
  filename: (req, file, cb) => {
    songUrl = Date.now() + file.originalname;
    cb(null, songUrl);
  },
});

const upload = multer({
  storage: Storage,
}).single("songeTitle");

module.exports.store = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newSong = new Song({
        title: req.body.title,
        message: req.body.message,
        songUrl: songUrl,
      });
      newSong
        .save()
        .then(() => {
          res.status(201).send(newSong);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

module.exports.index = async (req, res) => {
  const songs = await Song.find({});
  res.status(200).send(songs);
};

module.exports.fetchSingleSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.status(200).send(song);
  } catch (error) {
    res.status(404).send("not found");
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const song = await Song.findByIdAndRemove({ _id: req.params.id });
    const path = "assets/" + song.songUrl;
    // console.log("songpath", path);
    deletOldfile(path);
    res.status(200).send(song);
  } catch (error) {
    res.status(404).send("not found");
  }
};

module.exports.update = async (req, res) => {
  // const path = "assets/1676633381005record.mp3";
  console.log("req body", req.body, "req params", req.params.id);
  const song = await Song.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      artist: req.body.artist,
    },
    { new: true }
  );

  res.send(song);
};

module.exports.updateWithImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
    } else {
      const oldsong = await Song.findById(req.params.id);

      const song = await Song.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          artist: req.body.artist,
          songUrl: songUrl,
        },
        {
          new: true,
        }
      );
      const path = "assets/" + oldsong.songUrl;
      deletOldfile(path);
      res.status(204).send(song);
    }
  });
  // res.send(song);
};

function deletOldfile(path) {
  fs.unlinkSync(path, (err) => {
    if (err) {
      console.log("error message", err);
      res.send(err);
    }
  });
}
