const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY; // 32 bytes (256 bits) key
const iv = crypto.randomBytes(16); // 16 bytes (128 bits) IV

if (!secretKey) {
  console.error('Error: ENCRYPTION_KEY is not defined in environment variables. Data encryption will not work.');
}

const encrypt = (text) => {
  if (!secretKey) return text; // Return original text if key is missing
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Store IV with encrypted data
};

const decrypt = (text) => {
  if (!secretKey || !text) return text; // Return original text if key is missing or text is empty
  const parts = text.split(':');
  if (parts.length !== 2) return text; // Not an encrypted string, return as is
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(parts[0], 'hex'));
  let decrypted = decipher.update(parts[1], 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
