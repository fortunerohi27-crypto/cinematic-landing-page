// Argon2id wrappers. Tune cost params for dev (low) so seeding is snappy.
// In production, you'd bump memoryCost and timeCost.

import { hash as argonHash, verify as argonVerify } from "@node-rs/argon2";

// Argon2id is the default for @node-rs/argon2, so we just tune the cost params.
// Production should bump these (memoryCost 19456 → 65536+); dev uses lower values
// so seeding and sign-up stay snappy.
const OPTS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  return argonHash(plain, OPTS);
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  try {
    return await argonVerify(stored, plain);
  } catch {
    return false;
  }
}
