'use server';

import { createHash } from 'crypto';
import { readDb } from '@/lib/data';

function hashPassword(password: string): string {
  const sha256 = createHash('sha256');
  sha256.update(password);
  return sha256.digest('hex');
}

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
  // Ensure db.admin exists and has the required properties
  if (!db || !db.admin || !db.admin.username || !db.admin.passwordHash) {
    console.error("Admin credentials not found or incomplete in db.json");
    return false;
  }

  const { username: storedUsername, passwordHash: storedPasswordHash } = db.admin;

  const inputPasswordHash = hashPassword(password);
  
  const isUsernameMatch = username === storedUsername;
  const isPasswordMatch = inputPasswordHash === storedPasswordHash;

  return isUsernameMatch && isPasswordMatch;
}
