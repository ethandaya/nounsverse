export enum EtherscanPageType {
  TX = "tx",
  TOKEN = "token",
}

export function getEtherscanLink(
  type: EtherscanPageType,
  address: string,
  query?: string
) {
  return `https://etherscan.io//${type}/${address}${query ? `?${query}` : ""}`;
}
