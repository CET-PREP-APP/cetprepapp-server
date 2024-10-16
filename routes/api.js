const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { ContactForm } = require("../models");
const { Users } = require("../models");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const e = require("express");
const axios = require('axios');
const StudentUser = require("../models/StudentUser");
const FacultyUser = require("../models/FacultyUser");

//For SMTP Mail Sending
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Creates a new Contact request on database
router.post("/emailotp", async (req, res) => {
  const bodyData = req.body;
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();
  const ExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
  bodyData.OTP = OTP;
  bodyData.ExpiresAt = ExpiresAt;

  message1 = {
    from: "gamechanger00029@gmail.com",
    to: bodyData.Email,
    subject: `OTP for CET Prep App is ${OTP}`,
    html: `<p>OTP for CET Prep App is ${OTP}, it is valid for 5 minutes only</p>`,
  };
  if (bodyData.Email !== "") {
    transporter.sendMail(message1, function (err, info) {
      if (err) {
        console.log(err);
      }
    });
  }

  const createResponse = await OTP.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Route for OTP verification
router.post("/verifyotp", async (req, res) => {
  const { Email, OTP } = req.body;

  try {
    // Fetch the stored OTP and ExpiresAt from the database using the Email
    const user = await OTP.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { OTP: storedOTP, ExpiresAt } = user;

    // Check if the provided OTP matches the stored OTP and if it is still valid
    if (OTP === storedOTP && new Date() < new Date(ExpiresAt)) {
      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Creates a new contact request on database
router.post("/getintouch", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await ContactForm.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new StudentUser on database
router.post("/student-register", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await StudentUser.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new FacultyUser on database
router.post("/faculty-register", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await FacultyUser.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Verify User on database
router.post("/student-login", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await StudentUser.findOne({
    where: {
      Email: bodyData.Email,
      Password: bodyData.Password,
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Verify User on database
router.post("/facylty-login", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await FacultyUser.findOne({
    where: {
      Email: bodyData.Email,
      Password: bodyData.Password,
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});





// Gets the Contact by id
router.get("/contact/:id", async (req, res) => {
  const contactID = req.params.id;
  // console.log(contactID);
  const contactData = await ContactForm.findByPk(contactID, {
    // include: [
    //   {
    //     model: User,
    //     as: "user",
    //   },
    //   {
    //     model: Status,
    //     as: "status",
    //   },
    // ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(contactData);
});
// Delete the Contact by id
router.delete("/deleteContact/:id", async (req, res) => {
  const Id = req.params.id;
  // console.log(contactID);
  const contactData = await ContactForm.destroy({
    where: {
      Id: Id
    },
    // include: [
    //   {
    //     model: User,
    //     as: "user",
    //   },
    //   {
    //     model: Status,
    //     as: "status",
    //   },
    // ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(contactData);
});

// Gets Google Reviews
router.get("/reviews", async (req, res) => {
  const apiKey = process.env.API_KEY;
  const reviewsResponse = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJizxli4-p5zsRYUVs6CKc2bU&fields=name,rating,reviews&key=${apiKey}`
  )

  const reviews = reviewsResponse.data.result.reviews;

  const existingReviewsResponse = await axios.get("https://admin.greencurvesecurities.com/items/GoogleReviews");
  const existingReviews = existingReviewsResponse.data.data;

  const newReviews = reviews.filter(review => {
    const existingReview = existingReviews.find(er => er.author_name === review.author_name);
    return !existingReview;
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  for (const review of newReviews) {
    const postData = {
      author_name: review.author_name,
      profile_photo_url: review.profile_photo_url,
      rating: review.rating,
      text: review.text,
    };

    await axios.post("https://admin.greencurvesecurities.com/items/GoogleReviews", postData, config);
  }

  res.status(201).send(`New reviews posted successfully to Admin Portal`);
  // res.header({
  //   "Content-Type": "application/json",
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  //   "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  // });
  // res.json(Reviews.data);
});

// Gets all the Contacts
router.get("/contact", async (req, res) => {
  const contactData = await ContactForm.findAll({
    //order condition
    order: [["TimeStamp", "DESC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(contactData);
});

// Updates Contacted value
router.put("/contacted/:id", async (req, res) => {
  const contactID = req.params.id;
  const contactData = await ContactForm.update(
    { isContacted: true },
    {
      where: {
        Id: contactID,
      },
    }
  );
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(contactData);
});

module.exports = router;
