import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import path from "path";

dotenv.config();

const app = express();
const port = 3000;

const links = [
  "https://ocw.mit.edu/search/?d=Mathematics",
  "https://ocw.mit.edu/search/?d=Physics",
  "https://ocw.mit.edu/search/?d=Chemistry",
  "https://ocw.mit.edu/search/?d=Electrical%20Engineering%20and%20Computer%20Science",
  "https://ocw.mit.edu/search/?d=Engineering%20Systems%20Division&d=Chemical%20Engineering&d=Mechanical%20Engineering&d=Biological%20Engineering&d=Electrical%20Engineering%20and%20Computer%20Science&d=Nuclear%20Science%20and%20Engineering&d=Materials%20Science%20and%20Engineering&d=Civil%20and%20Environmental%20Engineering",
  "https://ocw.mit.edu/search/?d=Biology",
];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home.ejs"); 
});

app.get("/game", (req, res) => {
  res.render("game.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/frame", (req, res) => {
  const buttonIdx = req.body.idx;
  const courseLink = links[buttonIdx];
  console.log(`POST Request recieved, index : ${buttonIdx}, link: ${courseLink}`);

  res.render("frame.ejs", {
    mitLink : courseLink,
  });
});

app.post("/contact-me", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `MIT Site Contact Form Email from ${name}`,
      text: message,
      replyTo: email,
    });

    // res.status(200).send("Message sent successfully!");
    res.send(`
      <script>
        alert("Message sent successfully!");
        window.location.href = "/contact";
      </script>
    `);
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending message.");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});