import { useEnsAvatar, useEnsName } from "wagmi";
import { useBalanceExtended } from "./useBalanceAtBlock";

export function useProfile(address?: string, blockNumber?: string | number) {
  const { data: ensName } = useEnsName({ address });
  const { data: avatarURI } = useEnsAvatar({
    addressOrName: address,
  });
  // TODO - should add behaviour to only show valid at block balance when archived auction?
  const { data } = useBalanceExtended({
    addressOrName: address,
    blockNumber:
      typeof blockNumber === "string" ? parseInt(blockNumber, 10) : blockNumber,
  });

  return {
    ensName,
    avatarURI,
    balance: data?.value,
  };
}
