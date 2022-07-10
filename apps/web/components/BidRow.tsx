import { Bid } from "../services/interfaces/noun.service";
import { columnTemplate } from "./BidTable";
import { Avatar, Box } from "degen";
import { shortenAddress, shortenTx } from "../utils/address";
import { formatEther } from "ethers/lib/utils";
import { mul, sum, toFixed } from "../utils/numbers";
import { useBidsForAddress } from "../hooks/useBidsForAddress";
import formatDistanceToNow from "date-fns/formatDistanceToNowStrict";
import fromUnixTime from "date-fns/fromUnixTime";
import { useProfile } from "../hooks/useProfile";
import { useEthPrice } from "../hooks/useEthPrice";
import { blockNumberCol } from "./BidRow.css";
import { Text } from "../elements/Text";
import { formatAgo } from "../utils/dates";

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
      <Text variant="small" color="textSecondary" className={blockNumberCol}>
        {bid.blockNumber}
      </Text>
      <Box>
        <Text font="mono" marginBottom="1">
          {shortenTx(bid.id)}
        </Text>
        <Text variant="small" font="mono" color="textSecondary">
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
          <Text
            font="mono"
            transform={ensName ? "uppercase" : undefined}
            marginBottom="1"
          >
            {ensName || shortenAddress(bid.bidder.address)}
          </Text>
          <Text variant="small" color="textSecondary">
            {bid.bidder.tokenBalanceRaw} Nouns
          </Text>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column">
        <Text font="mono" transform="uppercase" marginBottom="1">
          ETH {formatEther(bid.amount)}
        </Text>
        <Text font="mono" variant="small" color="textSecondary">
          ${rate ? mul(rate, formatEther(bid.amount)).toFixed(2) : ""}
        </Text>
      </Box>
      <Box display="flex" flexDirection="column">
        <Text font="mono" transform="uppercase" marginBottom="1">
          ETH {balance ? toFixed(formatEther(balance), 2) : ""}
        </Text>
        <Text font="mono" variant="small" color="textSecondary">
          ${rate && balance ? mul(rate, formatEther(balance)).toFixed(2) : ""}
        </Text>
      </Box>
      <Box>
        <Text font="mono" marginBottom="1">
          {bids?.length}
        </Text>
        <Text font="mono" variant="small" color="textSecondary">
          ETH {sum(bids?.map((b: Bid) => formatEther(b.amount))).toFixed(2)}
        </Text>
      </Box>
      <Box>
        <Text font="mono" transform="uppercase">
          {formatAgo(formatDistanceToNow(fromUnixTime(bid.blockTimestamp)))}
        </Text>
      </Box>
    </Box>
  );
}
