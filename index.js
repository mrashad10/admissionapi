const mqtt = require("mqtt");
const express = require("express");
const client = mqtt.connect('mqtt://admission_rabbitmq:1883');
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.post(
  "/",
  body("username").isAlpha().withMessage("Username must be alphabetic only"),
  body("username")
    .isLength({
      min: 1,
      max: 64,
    })
    .withMessage("Username must be between 1 and 64 chars long"),
  (req, res) => {
    // return res.send("Received a POST HTTP method");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const message = {
      username: req.body.username,
      key: crypto.randomBytes(16).toString("hex"),
    };

    if (client.connected) {
      client.publish("session", JSON.stringify(message), () => {
        res.status(201);
        res.send(message);
      });
    } else {
      res.status(500);
      res.send("RabbitMQ is disconnected");
    }
  }
);

client.on("connect", () => {
  console.log("Rabbit is connected");
});

app.listen(3000, () => {
  console.log("Server is up");
});
