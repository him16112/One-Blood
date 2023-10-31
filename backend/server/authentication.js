const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const secretKey = 'your-secret-key';
const User = require('../database/userModel'); 







app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


app.use(bodyParser.json());
app.use(cookieParser()); 

















// Define an endpoint to get available donors with the same blood group
app.get('/availableDonors', verifyToken, async (req, res) => {
  const userBloodGroup = req.cookies.bloodGroup;
  const userId = req.user.id;
  const currentTime = new Date();

  try {
    // Use the User model to query available donors with matching blood group and availability
    const donorsWithMatchingBloodGroup = await User.find({
      bloodGroup: userBloodGroup,
      availability: {
        $exists: true,
        $not: { $size: 0 },
        // Filter availability entries that haven't exceeded the current time
        // $elemMatch: {
        //   date: { $gte: currentTime },
        // },
      },
      _id: { $ne: userId },
    });

    res.json(donorsWithMatchingBloodGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



























// Get all users who have posted a request matching the user's blood group
app.get('/usersRequests', verifyToken, async (req, res) => {
  const userBloodGroup = req.cookies.bloodGroup;
  const userId = req.user.id; // Assuming you have a way to get the current user's ID.
  const userAddress = req.user.address;
  const currentTime = new Date(); // Get the current date and time

  try {
    // Use the User model to query users who have posted matching requests, excluding the requests of the current user.
    const usersWithMatchingRequests = await User.find({
      bloodGroup: userBloodGroup,
      requests: {
        $exists: true,
        $not: { $size: 0 },
        // Filter requests that haven't exceeded the current time
        $elemMatch: {
          date: { $gte: currentTime },
        },
      },
      _id: { $ne: userId }, // Exclude requests by the current user
    });

    // usersWithMatchingRequests.forEach((user) => {
    //   user.requests.forEach((request) => {
    //     request.distance = calculateDistance(userAddress, user.address);
    //   });
    // });
  
    // usersWithMatchingRequests.sort((a, b) => a.requests.distance - b.requests.distance);  





    console.log(usersWithMatchingRequests);

    res.json(usersWithMatchingRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





















// Create a new POST route for scheduling availability
app.post('/scheduleAvailability', verifyToken, async (req, res) => {
  try {
    // Get the user data from the token (you can access it as req.user)
    const { date } = req.body;

    // Create a new schedule document and save it to the database using the User model
    const schedule = {
      date,
    };

    // Save the schedule to the user's document (assuming you have a User schema with an availability array)
    const user = await User.findById(req.user.id);
    user.availability.push(schedule);
    await user.save();

    res.json({ message: 'Availability schedule created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





















// POST A REQUEST
app.post('/postRequest', verifyToken, async (req, res) => {
  try {
    // Get the user data from the token (you can access it as req.user)
    const {date} = req.body;

    // Create a new schedule document and save it to the database using the User model
    const schedule = {
      date,
    };

    // Save the schedule to the user's document (assuming you have a User schema with an availability array)
    const user = await User.findById(req.user.id);
    user.requests.push(schedule);
    await user.save();

    res.json({ message: 'Post Request created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

























// Get all users route
app.get('/getUsers', async (req, res) => {
  try {
    // Use the User model to query all users from the database
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

















// REGISTER ROUTE
app.post('/register', async (req, res) => {
  const { username, password, email, phoneNo, address, bloodGroup } = req.body;

  // Check if the username is already in use
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400).json({ message: 'Username already in use' });
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user to the database
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      phoneNo,
      address,
      bloodGroup,
    });

    await newUser.save();

    res.json({ message: 'Registration successful' });
  }
});


















// Login route


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({ username });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
  } else {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      // Use the user's ID to query the user's blood group
      const userBloodGroup = user.bloodGroup;

      const token = jwt.sign(
        { id: user._id, username: user.username },
        secretKey,
        { expiresIn: '900s' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900000,
      });

      res.cookie('bloodGroup', userBloodGroup, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900000,
      });

      res.json({ message: 'Login successful', bloodGroup: userBloodGroup });
    }
  }
});















// Logout Route

app.post('/logout', (req, res) => {

  res.clearCookie('token'); // Clear the HttpOnly cookie
  res.status(200).json({ message: 'Logout successful' });

});


















// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected resource accessed successfully' });
});























// Verify JWT middleware


function verifyToken(req, res, next) {
  const token = req.cookies.token; // Read token from HttpOnly cookie

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
  } 
  
  else {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Token is invalid' });
      } else {
        req.user = user;
        next();
      }
    });
  }
}






















app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});







































































