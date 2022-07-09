import { getAddress } from "@ethersproject/address";

export const NOUN_TOKEN_ADDRESS = "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03";

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
