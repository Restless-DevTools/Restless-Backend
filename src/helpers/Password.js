import bcrypt from 'bcrypt';

async function encryptPassword(password) {
  const ecryptPass = await bcrypt.hash(password, 10);
  return ecryptPass;
}

async function comparePassword(password, hash) {
  const compare = await bcrypt.compare(password, hash);
  return compare;
}

export default {
  encryptPassword,
  comparePassword,
};
