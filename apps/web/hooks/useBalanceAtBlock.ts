import * as React from "react";
import {
  QueryConfig,
  QueryFunctionArgs,
} from "wagmi/dist/declarations/src/types";
import { useBlockNumber, useProvider, useQuery } from "wagmi";
import {
  fetchBalance,
  FetchBalanceArgs,
  FetchBalanceResult,
} from "../actions/fetchBalance";

export type UseChainIdArgs = {
  chainId?: number;
};

export function useChainId({ chainId }: UseChainIdArgs = {}) {
  const provider = useProvider({ chainId });
  return provider.network.chainId;
}

export type UseBalanceArgs = Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean;
};

export type UseBalanceConfig = QueryConfig<FetchBalanceResult, Error> & {
  blockNumber?: number;
};

export const queryKey = ({
  addressOrName,
  chainId,
  formatUnits,
  token,
  blockNumber,
}: Partial<FetchBalanceArgs> & {
  chainId?: number;
}) =>
  [
    {
      entity: "balance",
      addressOrName,
      chainId,
      formatUnits,
      token,
      blockNumber,
    },
  ] as const;

const queryFn = ({
  queryKey: [{ addressOrName, chainId, formatUnits, token, blockNumber }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!addressOrName) throw new Error("address is required");
  return fetchBalance({
    addressOrName,
    chainId,
    formatUnits,
    blockNumber,
    token,
  });
};

export function useBalanceExtended({
  addressOrName,
  cacheTime,
  blockNumber: blockNumberArg,
  chainId: chainId_,
  enabled = true,
  formatUnits = "ether",
  staleTime,
  suspense,
  token,
  watch,
  onError,
  onSettled,
  onSuccess,
}: UseBalanceArgs & UseBalanceConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ });
  const balanceQuery = useQuery(
    queryKey({
      addressOrName,
      chainId,
      formatUnits,
      token,
      blockNumber: blockNumberArg,
    }),
    queryFn,
    {
      cacheTime,
      enabled: Boolean(enabled && addressOrName),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
    }
  );

  const { data: blockNumber } = useBlockNumber({ watch });
  React.useEffect(() => {
    if (!enabled) return;
    if (!watch) return;
    if (!blockNumber) return;
    if (!addressOrName) return;
    balanceQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return balanceQuery;
}
