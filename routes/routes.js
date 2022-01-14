const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const { sendMessage } = require('../models/rabbit')
const crypto = require('crypto')

router.post(
  '/',
  body('username').isAlpha().withMessage('must be alphabetic only'),
  body('username')
    .isLength({
      min: 1,
      max: 64
    })
    .withMessage('must be between 1 and 64 chars long'),
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const message = {
      username: req.body.username,
      key: crypto.randomBytes(16).toString('hex')
    }
    sendMessage(message)
    res.status(201)
    res.send(message)
  }
)

module.exports = router
