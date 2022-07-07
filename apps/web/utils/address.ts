import { getAddress } from "@ethersproject/address";

export function shortenAddress(_address: string, length: number = 4) {
  const address = getAddress(_address);
  return (
    address.substring(0, length + 2) +
    "..." +
    address.substring(address.length - length)
  );
}
