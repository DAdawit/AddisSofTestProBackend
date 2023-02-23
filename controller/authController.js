const User = require("../models/User");
const jwt = require("jsonwebtoken");
const maxAge = 3.24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, "master wong,master shing", {
    expiresIn: maxAge,
  });
};

function handleError(err) {
  let errors = {
    email: "",
    password: "",
  };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "email is not registered";
  }

  // incorrect email
  if (err.message == "incorrect password") {
    errors.password = "incorrect password";
  }
  if (err.code === 11000) {
    errors.email = "email already taken";
    return errors;
  }
  console.log(err);
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}
module.exports.singup_post = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = createToken(user._id);
    res.cookie("Token", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).send(user);
  } catch (err) {
    const error = handleError(err);
    res.status(400).send(error);
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("Token", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).send(user);
  } catch (err) {
    const errors = handleError(err);
    console.log(err.message);
    res.status(400).send(errors);
  }
};

module.exports.verifyToken = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "master wong,master shing", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.send(err.message);
      } else {
        const user = await User.findById(decodedToken.id);
        res.send(user);
      }
    });
  }
};

module.exports.logout_user = async (req, res) => {
  res.cookie("Token", "", { maxAge: 1 });
  res.status(200).send({ message: "loged out " });
};
