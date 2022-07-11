export enum EtherscanPageType {
  TX = "tx",
  TOKEN = "token",
  ADDRESS = "address",
  BLOCK = "block",
}

export function getEtherscanLink(
  type: EtherscanPageType,
  pk: string | number,
  query?: string
) {
  return `https://etherscan.io/${type}/${pk}${query ? `?${query}` : ""}`;
}
