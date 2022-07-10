import Big from "big.js";
import { BigNumberish } from "ethers";

export function toFixed(value: BigNumberish, decimals: number) {
  return new Big(value.toString()).toFixed(decimals);
}

export function mul(value: BigNumberish, multiplier: BigNumberish) {
  return new Big(value.toString()).times(multiplier.toString());
}

export function sum(values: BigNumberish[] = []) {
  const bigNumberValues = values.map((value) => new Big(value.toString()));
  return bigNumberValues.reduce((acc, value) => acc.plus(value), new Big(0));
}
