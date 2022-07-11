import { getAddress } from "@ethersproject/address";

export const NOUN_TOKEN_ADDRESS = process.env
  .NEXT_PUBLIC_NOUNS_ADDRESS as string;
if (!NOUN_TOKEN_ADDRESS) {
  throw new Error("NEXT_PUBLIC_NOUNS_ADDRESS is a required env var");
}
export const LIL_NOUN_TOKEN_ADDRESS = process.env
  .NEXT_PUBLIC_LIL_NOUNS_ADDRESS as string;
if (!LIL_NOUN_TOKEN_ADDRESS) {
  throw new Error("NEXT_PUBLIC_LIL_NOUNS_ADDRESS is a required env var");
}

function shortenString(str: string, length: number = 4) {
  return (
    str.substring(0, length + 2) + "..." + str.substring(str.length - length)
  );
}

export function shortenAddress(_address: string, length: number = 4) {
  const address = getAddress(_address);
  return shortenString(address, length);
}

export function shortenTx(txHash: string, length: number = 4) {
  return shortenString(txHash, length);
}

export function isAddressMatch(addressA: string, addressB: string) {
  try {
    return getAddress(addressA) === getAddress(addressB);
  } catch (e) {
    return;
  }
}
