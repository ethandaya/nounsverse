import { Bid } from "../services/interfaces/noun.service";
import { useEthPrice } from "../hooks/useEthPrice";
import { useProfile } from "../hooks/useProfile";
import { useBidsForAddress } from "../hooks/useBidsForAddress";
import { EtherscanPageType, getEtherscanLink } from "../utils/url";
import { Box, Skeleton, vars } from "degen";
import { BidCardLabel, BidCardRoot } from "./BidCard.css";
import { Text } from "../elements/Text";
import { shortenTx } from "../utils/address";
import { formatAgo } from "../utils/dates";
import formatDistanceToNow from "date-fns/formatDistanceToNowStrict";
import fromUnixTime from "date-fns/fromUnixTime";
import { ArrowUpRight } from "react-feather";
import { BidderBlock } from "./Bid/BidderBlock";
import { mul, sum, toFixed } from "../utils/numbers";
import { formatEther } from "ethers/lib/utils";

type BidCardProps = {
  bid: Bid;
};

// TODO - componetise BidBlocks for reuse
export function BidCard({ bid }: BidCardProps) {
  const { rate } = useEthPrice(bid.blockNumber);
  const { ensName, avatarURI, balance } = useProfile(
    bid.bidder.address,
    bid.blockNumber
  );
  const { bids, isLoading: isBidsLoading } = useBidsForAddress({
    address: bid.bidder.address,
    blockNumber: bid.blockNumber,
  });

  return (
    <Box
      as="a"
      className={BidCardRoot}
      href={getEtherscanLink(EtherscanPageType.TX, bid.id)}
      target="_blank"
      rel="noreferrer"
      marginBottom="5"
    >
      <Box>
        <Text className={BidCardLabel} variant="label">
          Tx Hash
        </Text>
        <Text font="mono">{shortenTx(bid.id)}</Text>
        <Text variant="small" font="mono" color="textSecondary">
          {bid.blockIndex}
        </Text>
      </Box>
      <Box>
        <Text className={BidCardLabel} variant="label">
          When
        </Text>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Text font="mono" transform="uppercase">
              {formatAgo(formatDistanceToNow(fromUnixTime(bid.blockTimestamp)))}
            </Text>
            <Text font="mono" variant="small" color="textSecondary">
              {bid.blockTimestamp}
            </Text>
          </Box>
          <ArrowUpRight color={vars.colors.yellow} size={20} />
        </Box>
      </Box>
      <Box>
        <Text className={BidCardLabel} variant="label">
          Bidder
        </Text>
        <BidderBlock
          bidderENS={ensName}
          avatarURI={avatarURI}
          bidderAddress={bid.bidder.address}
          tokenBalance={bid.bidder.tokenBalanceRaw}
        />
      </Box>
      <Box>
        <Text className={BidCardLabel} variant="label">
          Bid
        </Text>
        <Text font="mono" transform="uppercase">
          ETH {toFixed(formatEther(bid.amount), 2)}
        </Text>
        <Skeleton loading={!rate} width="6" height="2" radius="medium">
          <Text font="mono" variant="small" color="textSecondary">
            ${rate && mul(rate, formatEther(bid.amount)).toFixed(2)}
          </Text>
        </Skeleton>
      </Box>
      <Box>
        <Text className={BidCardLabel} variant="label">
          Eth Balance
        </Text>
        <Skeleton loading={!balance} width="12" height="3" radius="medium">
          <Text font="mono" transform="uppercase">
            ETH {balance && toFixed(formatEther(balance), 2)}
          </Text>
        </Skeleton>
        <Skeleton
          loading={!rate || !balance}
          width="6"
          height="2"
          radius="medium"
        >
          <Text font="mono" variant="small" color="textSecondary">
            ${rate && balance && mul(rate, formatEther(balance)).toFixed(2)}
          </Text>
        </Skeleton>
      </Box>
      <Box>
        <Text className={BidCardLabel} variant="label">
          Prev Bids
        </Text>
        <Skeleton loading={isBidsLoading} width="12" height="3" radius="medium">
          <Text font="mono">{bids?.length || "0"}</Text>
        </Skeleton>
        <Skeleton loading={isBidsLoading} width="6" height="2" radius="medium">
          <Text font="mono" variant="small" color="textSecondary">
            ETH {sum(bids?.map((b: Bid) => formatEther(b.amount))).toFixed(2)}
          </Text>
        </Skeleton>
      </Box>
    </Box>
  );
}
