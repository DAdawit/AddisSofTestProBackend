const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Song = require("../models/Song");
const authController = require("../controller/authController");
const SongController = require("../controller/SongsController");

// router.get("/ninjas", (req, res, next) => {
// Ninja.geoNear(
//   {
//     type: "Point",
//     coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
//   },
//   { maxDistance: 10000, spherical: true }
// ).then((response) => {
//   res.send(response);
// });
//   Ninja.find({}).then((response) => {
//     res.send(response);
//   });
// });
// router.post("/ninjas", (req, res, next) => {
//   Ninja.create(req.body)
//     .then((response) => {
//       res.send(response);
//     })
//     .catch(next);
// });

// router.put("/ninjas/:id", (req, res, next) => {
//   Ninja.findByIdAndUpdate({ _id: req.params.id }, req.body)
//     .then(() => {
//       Ninja.findOne({ _id: req.params.id }).then((response) => {
//         res.send(response);
//       });
//     })
//     .catch(next);
// });

// router.delete("/ninjas/:id", (req, res, next) => {
//   Ninja.findByIdAndRemove({ _id: req.params.id })
//     .then((response) => {
//       res.send(response);
//     })
//     .catch(next);
// });

router.post("/signup", authController.singup_post);
router.post("/login", authController.login_post);
router.post("/verifyToken", authController.verifyToken);
router.get("/logout", authController.logout_user);

router.post("/songs", SongController.store);
router.get("/songs", SongController.index);
router.get("/songs/:id", SongController.fetchSingleSong);
router.delete("/songs/:id", SongController.destroy);
router.put("/songs/:id", SongController.update);
router.put("/update/:id", SongController.updateWithImage);
module.exports = router;
