const jwt = require('jwt-simple');
const User = require('../models/user');
const secret = process.env.SECRET;

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, secret);
}

exports.signin = function (req, res, next) {
  // User has already had their email and password auth'ed
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(422)
      .send({ error: 'Email and password must be provided' });

  try {
    // See if a user with the given email exists
    const existingUser = await User.findOne({ email });

    // If a user with the email exists return an error
    if (existingUser) return res.status(422).send({ error: 'Email is in use' });

    // If a user with the email does NOT exist, create and save user record
    const user = new User({ email, password });
    await user.save();

    // Respond to request indicating that user was created
    return res.json({ token: tokenForUser(user) });
  } catch (error) {
    next(error);
  }
};
