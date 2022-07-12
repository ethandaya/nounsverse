import { Bid } from "../services/interfaces/noun.service";
import { Avatar, Box, Skeleton, vars } from "degen";
import { shortenAddress, shortenTx } from "../utils/address";
import { formatEther } from "ethers/lib/utils";
import { mul, sum, toFixed } from "../utils/numbers";
import { useBidsForAddress } from "../hooks/useBidsForAddress";
import formatDistanceToNow from "date-fns/formatDistanceToNowStrict";
import fromUnixTime from "date-fns/fromUnixTime";
import { useProfile } from "../hooks/useProfile";
import { useEthPrice } from "../hooks/useEthPrice";
import { Text } from "../elements/Text";
import { formatAgo } from "../utils/dates";
import { ArrowUpRight } from "react-feather";
import { BidRowColContainer, BidRowRoot } from "./BidRow.css";
import { EtherscanPageType, getEtherscanLink } from "../utils/url";

type BidRowProps = {
  bid: Bid;
};

// TODO - add motion to animate in render
export function BidRow({ bid }: BidRowProps) {
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
      href={getEtherscanLink(EtherscanPageType.TX, bid.id)}
      target="_blank"
      rel="noreferrer"
      className={BidRowRoot}
      marginBottom="5"
    >
      <Text variant="small" color="textSecondary">
        {bid.blockNumber}
      </Text>
      <Box className={BidRowColContainer}>
        <Text font="mono">{shortenTx(bid.id)}</Text>
        <Text variant="small" font="mono" color="textSecondary">
          {bid.blockIndex}
        </Text>
      </Box>
      <a
        href={getEtherscanLink(
          EtherscanPageType.ADDRESS,
          ensName || bid.bidder.address
        )}
        target="_blank"
        rel="noreferrer"
      >
        <Box display="flex" flexDirection="row" justifyContent="flex-start">
          {avatarURI ? (
            <Avatar label="Avatar" src={avatarURI} size="6" shape="square" />
          ) : (
            <Box
              width="6"
              height="6"
              backgroundColor="yellow"
              borderRadius="2xLarge"
            />
          )}
          <Box display="flex" flexDirection="column" marginLeft="2.5">
            <Text
              font="mono"
              transform={ensName ? "uppercase" : undefined}
              marginBottom="1"
              underline="hover"
            >
              {ensName || shortenAddress(bid.bidder.address)}
            </Text>
            <Text variant="small" color="textSecondary">
              {bid.bidder.tokenBalanceRaw} Nouns
            </Text>
          </Box>
        </Box>
      </a>
      <Box className={BidRowColContainer}>
        <Text font="mono" transform="uppercase">
          ETH {toFixed(formatEther(bid.amount), 2)}
        </Text>
        <Skeleton loading={!rate} width="6" height="2" radius="medium">
          <Text font="mono" variant="small" color="textSecondary">
            ${rate && mul(rate, formatEther(bid.amount)).toFixed(2)}
          </Text>
        </Skeleton>
      </Box>
      <Box className={BidRowColContainer}>
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
      <Box className={BidRowColContainer}>
        <Skeleton loading={isBidsLoading} width="12" height="3" radius="medium">
          <Text font="mono">{bids?.length || "0"}</Text>
        </Skeleton>
        <Skeleton loading={isBidsLoading} width="6" height="2" radius="medium">
          <Text font="mono" variant="small" color="textSecondary">
            ETH {sum(bids?.map((b: Bid) => formatEther(b.amount))).toFixed(2)}
          </Text>
        </Skeleton>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Text font="mono" transform="uppercase" marginBottom="1">
            {formatAgo(formatDistanceToNow(fromUnixTime(bid.blockTimestamp)))}
          </Text>
          <Text font="mono" variant="small" color="textSecondary">
            {bid.blockTimestamp}
          </Text>
        </Box>
        <ArrowUpRight color={vars.colors.yellow} size={20} />
      </Box>
    </Box>
  );
}
