import { Bid } from "../services/interfaces/noun.service";
import { columnTemplate } from "./BidTable";
import { Avatar, Box, Text } from "degen";
import { shortenTx } from "../utils/address";
import { formatEther } from "ethers/lib/utils";
import { mul, toFixed } from "../utils/numbers";
import { useBidsForAddress } from "../hooks/useBidsForAddress";
import formatDistanceToNow from "date-fns/formatDistanceToNowStrict";
import fromUnixTime from "date-fns/fromUnixTime";
import { useProfile } from "../hooks/useProfile";
import { useEthPrice } from "../hooks/useEthPrice";

type BidRowProps = {
  bid: Bid;
};

export function BidRow({ bid }: BidRowProps) {
  const { rate } = useEthPrice(bid.blockNumber);
  const { ensName, avatarURI, balance } = useProfile(
    bid.bidder.address,
    bid.blockNumber
  );
  const { bids } = useBidsForAddress({
    address: bid.bidder.address,
    blockNumber: bid.blockNumber,
  });

  return (
    <Box
      display="grid"
      style={{
        gridTemplateColumns: columnTemplate,
      }}
      marginBottom="5"
    >
      <Box>
        <Text transform="uppercase">{bid.blockNumber}</Text>
      </Box>
      <Box>
        <Text transform="uppercase">{shortenTx(bid.id)}</Text>
        <Text variant="label">{bid.blockIndex}</Text>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-start">
        {avatarURI ? (
          <Avatar label="Avatar" src={avatarURI} size="12" shape="square" />
        ) : (
          <Box
            width="12"
            height="12"
            backgroundColor="accent"
            borderRadius="2xLarge"
          />
        )}
        <Box display="flex" flexDirection="column" marginLeft="2.5">
          <Text transform="uppercase">
            {ensName || shortenTx(bid.bidder.address)}
          </Text>
          <Text color="textSecondary">{bid.bidder.tokenBalanceRaw} Nouns</Text>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column">
        <Text transform="uppercase">{formatEther(bid.amount)}</Text>
        <Text transform="uppercase" color="textSecondary">
          ${rate ? mul(rate, formatEther(bid.amount)).toFixed(2) : ""}
        </Text>
      </Box>
      <Box display="flex" flexDirection="column">
        <Text transform="uppercase">
          {balance ? toFixed(formatEther(balance), 2) : ""}
        </Text>
        <Text transform="uppercase" color="textSecondary">
          ${rate && balance ? mul(rate, formatEther(balance)).toFixed(2) : ""}
        </Text>
      </Box>
      <Box>
        <Text transform="uppercase">{bids?.length}</Text>
      </Box>
      <Box>
        <Text transform="uppercase">
          {formatDistanceToNow(fromUnixTime(bid.blockTimestamp))} AGO
        </Text>
      </Box>
    </Box>
  );
}
