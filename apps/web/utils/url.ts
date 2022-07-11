export enum EtherscanPageType {
  TX = "tx",
  TOKEN = "token",
  ADDRESS = "address",
}

export function getEtherscanLink(
  type: EtherscanPageType,
  address: string,
  query?: string
) {
  return `https://etherscan.io/${type}/${address}${query ? `?${query}` : ""}`;
}
