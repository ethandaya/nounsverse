import Big from "big.js";
import { BigNumberish } from "ethers";

export function toFixed(value: BigNumberish, decimals: number) {
  console.log({ value });
  return new Big(value.toString()).toFixed(decimals);
}
