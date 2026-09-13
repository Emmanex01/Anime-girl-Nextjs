import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

function getKey(): Buffer {
  const value = process.env.TOKEN_ENCRYPTION_KEY;

  if (!value) {
    throw new Error("TOKEN_ENCRYPTION_KEY is not configured");
  }

  const key = Buffer.from(value, "base64");

  if (key.length !== 32) {
    throw new Error(
      "TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes",
    );
  }

  return key;
}

export function encrypt(value: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    algorithm,
    getKey(),
    iv,
  );

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decrypt(payload: string): string {
  const [ivValue, authTagValue, encryptedValue] =
    payload.split(".");

  if (!ivValue || !authTagValue || !encryptedValue) {
    throw new Error("Invalid encrypted payload");
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    getKey(),
    Buffer.from(ivValue, "base64url"),
  );

  decipher.setAuthTag(
    Buffer.from(authTagValue, "base64url"),
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedValue, "base64url"),
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}