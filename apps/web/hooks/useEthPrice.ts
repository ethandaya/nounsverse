import useSWR from "swr";
import uniswapService from "../services/uniswap.service";

export function useEthPrice(blockNumber: number) {
  const { data, ...rest } = useSWR(
    ["getEthPrice", blockNumber],
    (_, blockNumber) => uniswapService.getETHPrice(blockNumber)
  );

  return { rate: data, ...rest };
}
