// // // /controllers/auth.js
// // const express = require('express');
// // const router = express.Router();
// // const bcrypt = require('bcrypt');

// // const User = require('../models/user');


// // router.post('/sign-up', async (req, res) => {
// //   try {

// //     const {username, password} = req.body;
// //     const existingUser = await User.findOne({username})
    
// //      if(existingUser) {  
// //         return res.status(409).json({err:'Username or password is Invalid.'});
// //     }

// //    const hashedPassword = bcrypt.hashSync(password, saltRounds);
// //    const newUser = await User.create({ username, hashedPassword });

// //     res.status(201).json({user: newUser});

// //   } catch (err) {
// //     res.status(400).json({err: "Invalid, Please try again letar."})
// //   }
// // });


// // module.exports = router;

// const express = require('express');
// const jwt = require('jsonwebtoken');
// const router = express.Router();
// const bcrypt = require('bcrypt');

// const User = require('../models/user');

// const saltRounds = 12;

// router.post('/sign-up', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const existingUser = await User.findOne({ username });

//     if (existingUser) {
//       return res.status(409).json({ err: 'Username or Password is invalid' });
//     }

//     const hashedPassword = bcrypt.hashSync(password, saltRounds);
//     const newUser = await User.create({ username, hashedPassword });

//     const payload = {
//         username: newUser.username,
//         _id: newUser._id,
//     }
//      const token = jwt.sign(payload, process.env.JWT_SECRET);

//     res.status(201).json({token});
//   } catch (err) {
//     res.status(400).json({ err: 'Invalid, Please try again.' });
//   }
// });


// router.post('/sign-in', async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });

//     if (!user) {
//       return res.status(401).json({ err: 'Invalid credentials. User' });
//     }
   
//     const isPasswordCorrect = bcrypt.compareSync(
//       req.body.password, user.hashedPassword
//     );
    
//     if (!isPasswordCorrect) {
//       return res.status(401).json({ err: 'Invalid credentials. Pass' });
//     }

//     const payload = { username: user.username, _id: user._id };
//     const token = jwt.sign({ payload }, process.env.JWT_SECRET);

//     res.status(200).json({ token });
 
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// });




// module.exports = router;








const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const saltRounds = 12;

router.post('/sign-up', async (req, res) => {
  console.log(req.body)
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ err: 'Username or Password is invalid' });
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = await User.create({ username, hashedPassword });

    const payload = {
      username: newUser.username,
      _id: newUser._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ err: 'Invalid, Please try again.' });
  }
});

router.post('/sign-in', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    // Check if the password is correct using bcrypt
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword);
    // If the password is incorrect, return a 401 status code with a message
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const payload = {
      username: user.username,
      _id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;