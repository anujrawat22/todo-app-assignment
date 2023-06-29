const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
    const { avatar, name, email, mobile, password, gender } = req.body;

    const findUser = await UserModel.findOne({ email });
console.log(findUser)
    if (findUser) {
      return res
        .status(401)
        .json({ msg: "User with this email already exists" });
    }
    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        return res.status(401).json({ Error: err });
      }

      const User = await new UserModel({
        name,
        email,
        password: hash,
        gender,
        mobile,
        avatar,
      });
      User.save();
      res.status(201).json({ msg: "User registered successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const User = await UserModel.findOne({ email });

    if (!User) {
      return res
        .status(404)
        .json({ msg: "User doesn't exist , Please signup" });
    }

    bcrypt.compare(password, User.password, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ Error: err });
      }

      if (result) {
        const token = jwt.sign(
          { userId: User._id, role: User.role, name: User.name },
          process.env.privatekey,
          { expiresIn: "7d" }
        );
        res.cookie("token", token);
        res
          .status(201)
          .json({ msg: "User logged in successfully", token, role: User.role });
      } else {
        res.status(401).json({ msg: "Invalid Credentials" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
