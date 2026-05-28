/**
 * Create or reset an admin user.
 * Usage:
 *   node src/scripts/createAdmin.js "Admin Name" admin@example.com SomePassword123
 */
import { connectDB } from '../config/db.js';
import { AdminUser } from '../models/AdminUser.js';
import mongoose from 'mongoose';

async function main() {
  const [, , name, email, password] = process.argv;
  if (!name || !email || !password) {
    console.error('Usage: node src/scripts/createAdmin.js "Name" email password');
    process.exit(1);
  }

  await connectDB();

  const lower = email.toLowerCase();
  let user = await AdminUser.findOne({ email: lower });
  if (user) {
    user.name = name;
    await user.setPassword(password);
    await user.save();
    console.log(`Updated existing admin: ${lower}`);
  } else {
    user = new AdminUser({ name, email: lower, role: 'admin' });
    await user.setPassword(password);
    await user.save();
    console.log(`Created admin: ${lower}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
