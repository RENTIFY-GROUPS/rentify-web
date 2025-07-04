const sendSms = async (options) => {
  // In a real application, you would integrate with an SMS gateway like Twilio here.
  // For now, we'll just log the SMS to the console.
  console.log(`Sending SMS to ${options.to}: ${options.message}`);
  // Example with Twilio:
  // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // await client.messages.create({
  //   body: options.message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: options.to,
  // });
};

module.exports = sendSms;
