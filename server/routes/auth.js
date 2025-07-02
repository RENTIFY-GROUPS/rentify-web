
const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const sendSms = require('../utils/sms');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['tenant', 'landlord']).withMessage('Role must be tenant or landlord'),
  body('referralCode').optional().isString().withMessage('Referral code must be a string')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    const { name, email, phone, password, role, referralCode } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode });
      if (!referredByUser) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    // Create new user
    user = new User({ name, email, phone, password, role, referredBy: referredByUser ? referredByUser._id : null });
    await user.save();

    // Award referral credit to referrer if applicable
    if (referredByUser) {
      referredByUser.referralCredit += 10; // Example: Award 10 units of credit
      await referredByUser.save();
      console.log(`Referral credit awarded to ${referredByUser.email}`);
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log(`User registered: ${email}`);

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If 2FA is enabled, prompt for 2FA token
    if (user.twoFactorEnabled || user.emailOtp || user.smsOtp) {
      return res.status(206).json({
        message: '2FA required',
        userId: user._id,
        totpEnabled: user.twoFactorEnabled,
        emailOtpEnabled: !!user.emailOtp,
        smsOtpEnabled: !!user.smsOtp
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log(`User logged in: ${email}`);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2FA Login Verification
router.post('/login/2fa', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('token').notEmpty().withMessage('2FA token is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA not enabled or set up for this user' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    // Generate JWT after successful 2FA verification
    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log(`User logged in with 2FA: ${user.email}`);
    res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth login
router.post('/google-login', async (req, res) => {
  const { tokenId, role } = req.body;
  if (!tokenId || !role) {
    return res.status(400).json({ message: 'Token ID and role are required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });
    if (!user) {
      // Check if email already exists
      user = await User.findOne({ email });
      if (user) {
        // Link googleId to existing user
        user.googleId = googleId;
        await user.save();
      } else {
        // Create new user
        user = new User({
          name,
          email,
          googleId,
          avatar: picture,
          role,
          phone: '' // optional, can be updated later
        });
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log(`User logged in with Google: ${email}`);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});


// Middleware to protect routes (assuming it exists or will be created)
const authMiddleware = (req, res, next) => {
  // Implement your authentication middleware here
  // For now, a placeholder that allows all requests
  next();
};

// 2FA Setup - Generate secret and QR code
router.post('/2fa/setup', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming req.user.id is set by authMiddleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Rentify (${user.email})`,
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error generating QR code' });
      }
      res.json({ secret: secret.base32, qrCodeUrl: data_url });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2FA Verify - Verify a token
router.post('/2fa/verify', authMiddleware, async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA not set up for this user' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1, // Allow a 30-second window either side of the current time
    });

    if (verified) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ message: 'Invalid 2FA token' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2FA Enable - Enable 2FA for a user
router.post('/2fa/enable', authMiddleware, async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA secret not set up' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (verified) {
      user.twoFactorEnabled = true;
      await user.save();
      res.json({ message: '2FA enabled successfully' });
    } else {
      res.status(400).json({ message: 'Invalid 2FA token' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2FA Disable - Disable 2FA for a user
router.post('/2fa/disable', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined; // Clear the secret
    await user.save();
    res.json({ message: '2FA disabled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2FA Status - Check if 2FA is enabled for a user
router.get('/2fa/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ twoFactorEnabled: user.twoFactorEnabled, emailOtpEnabled: !!user.emailOtp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request Email OTP
router.post('/2fa/email/request-otp', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.emailOtp = otp;
    user.emailOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    const emailHtml = `
      <p>Your Rentify 2FA One-Time Password (OTP) is:</p>
      <h3>${otp}</h3>
      <p>This code is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Rentify 2FA One-Time Password',
      html: emailHtml,
    });

    res.json({ message: 'Email OTP sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Email OTP
router.post('/2fa/email/verify-otp', authMiddleware, async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.emailOtp || !user.emailOtpExpires || user.emailOtp !== otp || user.emailOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    user.twoFactorEnabled = true; // Enable 2FA if OTP is verified
    await user.save();

    res.json({ message: 'Email OTP verified successfully. 2FA enabled.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Disable Email OTP
router.post('/2fa/email/disable', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    user.twoFactorEnabled = false; // Assuming disabling email OTP also disables 2FA entirely if no other method is enabled
    await user.save();

    res.json({ message: 'Email OTP disabled successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Request SMS OTP
router.post('/2fa/sms/request-otp', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.phone) {
      return res.status(400).json({ message: 'Phone number not provided for user.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.smsOtp = otp;
    user.smsOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    const smsMessage = `Your Rentify 2FA OTP is: ${otp}. This code is valid for 10 minutes.`;

    await sendSms({
      to: user.phone,
      message: smsMessage,
    });

    res.json({ message: 'SMS OTP sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify SMS OTP
router.post('/2fa/sms/verify-otp', authMiddleware, async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.smsOtp || !user.smsOtpExpires || user.smsOtp !== otp || user.smsOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.smsOtp = undefined;
    user.smsOtpExpires = undefined;
    user.twoFactorEnabled = true; // Enable 2FA if OTP is verified
    await user.save();

    res.json({ message: 'SMS OTP verified successfully. 2FA enabled.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Disable SMS OTP
router.post('/2fa/sms/disable', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.smsOtp = undefined;
    user.smsOtpExpires = undefined;
    user.twoFactorEnabled = false; // Assuming disabling SMS OTP also disables 2FA entirely if no other method is enabled
    await user.save();

    res.json({ message: 'SMS OTP disabled successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

