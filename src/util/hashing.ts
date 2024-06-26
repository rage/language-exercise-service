import { blake3 } from "@noble/hashes/blake3"
import { v5 } from "uuid"

export function generateRandomKey(length: number): Uint8Array {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return array
}

export function hexToUint8Array(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g)
  if (!matches) {
    throw new Error("Invalid hex string")
  }
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)))
}

export function uint8ArrayToHex(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export function oneWayStringToId(
  string: string,
  namespace: string,
  secretKey: string,
): string {
  // Creating a deterministic id for each option by using a one way cryptographic hash function to prevent leaking the correct answers
  // It uses the random string privateSpec.secretKey to ensure that the id cannot be brute forced
  const hash = blake3(string, {
    dkLen: 256,
    key: hexToUint8Array(secretKey),
  })
  // Uuid v5 is a convenient way to convert the uint8array to a string that is useable as an id. Actual security is provided by the blake3 hash.
  return v5(hash, namespace)
}
