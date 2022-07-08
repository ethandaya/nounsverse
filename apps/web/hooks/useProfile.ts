import { useBalance, useEnsAvatar, useEnsName } from "wagmi";

export function useProfile(address: string) {
  const { data: ensName } = useEnsName({ address });
  const { data: avatarURI } = useEnsAvatar({
    addressOrName: address,
  });
  // TODO - can we do archival to get balance @ block
  const { data } = useBalance({ addressOrName: address });

  return {
    ensName,
    avatarURI,
    balance: data?.value,
  };
}
