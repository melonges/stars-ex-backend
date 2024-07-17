import { webcrypto } from 'node:crypto';
import { ParsedTelegramInitData } from './auth.types';

export async function isValidTgInitData(data: string, botToken: string) {
  const parsedTgInitData = Object.fromEntries(new URLSearchParams(data));
  const encoder = new TextEncoder();

  const checkString = Object.keys(parsedTgInitData)
    .filter((key) => key !== 'hash')
    .map((key) => `${key}=${parsedTgInitData[key]}`)
    .sort()
    .join('\n');

  const secretKey = await webcrypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign'],
  );

  const secret = await webcrypto.subtle.sign(
    'HMAC',
    secretKey,
    encoder.encode(botToken),
  );

  const signatureKey = await webcrypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign'],
  );

  const signature = await webcrypto.subtle.sign(
    'HMAC',
    signatureKey,
    encoder.encode(checkString),
  );

  const hex = Buffer.from(signature).toString('hex');

  return parsedTgInitData.hash === hex;
}

export const parseTelegramInitData = (data: string): ParsedTelegramInitData => {
  const parsedTgInitData = Object.fromEntries(new URLSearchParams(data));
  parsedTgInitData.user = JSON.parse(parsedTgInitData.user);
  return parsedTgInitData as unknown as ParsedTelegramInitData;
};
