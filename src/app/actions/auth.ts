
'use server';

import { readDb } from '@/lib/data';

// This function is no longer needed for plain text comparison.
// function hashPassword(password: string): string {
//   const sha256 = createHash('sha256');
//   sha256.update(password);
//   return sha256.digest('hex');
// }

export async function verifyAdminCredentials({
  username,
  password,
}: {
  username: string;
  password?: string;
}): Promise<boolean> {
  if (!password) {
    return false;
  }
  
  const db = await readDb();
  // Ensure db and db.admin exist and have the required properties
  if (!db || !db.admin || !db.admin.username || !db.admin.password) {
    console.error("Admin credentials not found or incomplete in db.json");
    return false;
  }

  const { username: storedUsername, password: storedPassword } = db.admin;

  // Direct comparison instead of hashing
  const isUsernameMatch = username === storedUsername;
  const isPasswordMatch = password === storedPassword;

  return isUsernameMatch && isPasswordMatch;
}
