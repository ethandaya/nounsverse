import { getAddress } from "@ethersproject/address";

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
