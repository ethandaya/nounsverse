import { BigNumber, logger } from "ethers/lib/ethers";
import { formatUnits, isAddress, Logger } from "ethers/lib/utils";
import { erc20ABI, readContracts, Unit } from "wagmi";
import { wagmiClient, provider as wagmiProvider } from "../utils/network";

export type FetchBalanceArgs = {
  /** Address or ENS name */
  addressOrName: string;
  /** Chain id to use for provider */
  chainId?: number;
  /** Block number for balanaceAt */
  blockNumber?: number;
  /** Units for formatting output */
  formatUnits?: Unit | number;
  /** ERC-20 address */
  token?: string;
};

export type FetchBalanceResult = {
  decimals: number;
  formatted: string;
  symbol: string;
  unit: Unit | number;
  value: BigNumber;
};

export async function fetchBalance({
  addressOrName,
  chainId,
  formatUnits: unit = "ether",
  token,
  blockNumber,
}: FetchBalanceArgs): Promise<FetchBalanceResult> {
  const client = wagmiClient;
  const provider = wagmiProvider({ chainId });

  if (token) {
    const erc20Config = {
      addressOrName: token,
      contractInterface: erc20ABI,
      chainId,
    };

    // Convert ENS name to address if required
    let resolvedAddress: string;
    if (isAddress(addressOrName)) resolvedAddress = addressOrName;
    else {
      const address = await provider.resolveName(addressOrName);
      // Same error `provider.getBalance` throws for invalid ENS name
      if (!address)
        logger.throwError(
          "ENS name not configured",
          Logger.errors.UNSUPPORTED_OPERATION,
          {
            operation: `resolveName(${JSON.stringify(addressOrName)})`,
          }
        );
      resolvedAddress = address;
    }

    const [value, decimals, symbol] = await readContracts<
      [BigNumber, number, string]
    >({
      allowFailure: false,
      contracts: [
        { ...erc20Config, functionName: "balanceOf", args: resolvedAddress },
        { ...erc20Config, functionName: "decimals" },
        {
          ...erc20Config,
          functionName: "symbol",
        },
      ],
    });
    return {
      decimals,
      formatted: formatUnits(value ?? "0", unit),
      symbol,
      unit,
      value,
    };
  }

  const chains = [...(client.provider.chains || []), ...(client.chains ?? [])];
  const value = await provider.getBalance(addressOrName, blockNumber);
  const chain = chains.find((x) => x.id === provider.network.chainId);
  return {
    decimals: chain?.nativeCurrency?.decimals ?? 18,
    formatted: formatUnits(value ?? "0", unit),
    symbol: chain?.nativeCurrency?.symbol ?? "ETH",
    unit,
    value,
  };
}
