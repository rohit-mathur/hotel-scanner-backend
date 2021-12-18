const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
// const hbs = require("express-handlebars");
// const path = require("path");
const fs = require("fs");
const checkInTemplate = fs.readFileSync("src/templates/checkIn.html");

const app = express();

app.use(express.json());
app.use(cors());

// app.engine("hbs", hbs({ extname: "hbs", defaultLayout: "templates" }));
// app.set("templates", path.join(__dirname, "templates"));
// app.set("view engine", "hbs");

app.post("/sendCheckInEmail", (req, res) => {
  const emailInfo = req.body;
  emailInfo.html = `<h4>Enquiry Form Details</h4>
  <p><b>Name: ${req.body.name}</b></p>
  <p><b>Mobile No.: ${req.body.number}</b></p>
  <p><b>Email: ${req.body.email}</b></p>
  <p><b>Check In Date: ${req.body.checkinDate}</b></p>
  <p><b>Check Out Date: ${req.body.checkoutDate}</b></p>
  <p><b>Adults: ${req.body.guests.adults}</b></p>
  <p><b>Children: ${req.body.guests.children}</b></p>`;

  main(emailInfo).catch(console.error);
  res.status(201).send("Sent");
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log("test"));

// async..await is not allowed in global scope, must use a wrapper
async function main(data) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    tls: {
      minVersion: "TLSv1",
      rejectUnauthorized: false,
      ignoreTLS: false,
      requireTLS: true
    },
    auth: {
      user: "mathur232@gmail.com", // generated ethereal user
      pass: "Steel@1234" // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(data);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);
