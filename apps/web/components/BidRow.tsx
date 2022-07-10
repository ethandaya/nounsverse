import { Bid } from "../services/interfaces/noun.service";
import { columnTemplate } from "./BidTable";
import { Avatar, Box, Text } from "degen";
import { shortenAddress, shortenTx } from "../utils/address";
import { formatEther } from "ethers/lib/utils";
import { mul, toFixed } from "../utils/numbers";
import { useBidsForAddress } from "../hooks/useBidsForAddress";
import formatDistanceToNow from "date-fns/formatDistanceToNowStrict";
import fromUnixTime from "date-fns/fromUnixTime";
import { useProfile } from "../hooks/useProfile";
import { useEthPrice } from "../hooks/useEthPrice";
import * as styles from "./BidTable.module.css";
import { blockNumberCol } from "./BidRow.css";

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
        <Box className={blockNumberCol}>{bid.blockNumber}</Box>
      </Box>
      <Box>
        <Text font="mono">{shortenTx(bid.id)}</Text>
        <Text font="mono" variant="label">
          {bid.blockIndex}
        </Text>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-start">
        {avatarURI ? (
          <Avatar label="Avatar" src={avatarURI} size="12" shape="square" />
        ) : (
          <Box
            width="12"
            height="12"
            backgroundColor="yellow"
            borderRadius="2xLarge"
          />
        )}
        <Box display="flex" flexDirection="column" marginLeft="2.5">
          <Text font="mono" transform={ensName ? "uppercase" : undefined}>
            {ensName || shortenAddress(bid.bidder.address)}
          </Text>
          <Text color="textSecondary">{bid.bidder.tokenBalanceRaw} Nouns</Text>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column">
        <Text font="mono" transform="uppercase">
          ETH {formatEther(bid.amount)}
        </Text>
        <Text font="mono" transform="uppercase" color="textSecondary">
          ${rate ? mul(rate, formatEther(bid.amount)).toFixed(2) : ""}
        </Text>
      </Box>
      <Box display="flex" flexDirection="column">
        <Text font="mono" transform="uppercase">
          ETH {balance ? toFixed(formatEther(balance), 2) : ""}
        </Text>
        <Text font="mono" transform="uppercase" color="textSecondary">
          ${rate && balance ? mul(rate, formatEther(balance)).toFixed(2) : ""}
        </Text>
      </Box>
      <Box>
        <Text font="mono" transform="uppercase">
          {bids?.length}
        </Text>
      </Box>
      <Box>
        <Text font="mono" transform="uppercase">
          {formatDistanceToNow(fromUnixTime(bid.blockTimestamp))} AGO
        </Text>
      </Box>
    </Box>
  );
}
