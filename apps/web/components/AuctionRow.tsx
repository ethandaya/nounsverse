import { Avatar, Box, vars } from "degen";
import { BidTable } from "./BidTable";
import { Auction } from "../services/interfaces/noun.service";
import { auctionHero } from "./AuctionRow.css";
import { toFixed } from "../utils/numbers";
import { formatEther } from "ethers/lib/utils";
import { useNoun } from "../hooks/useNoun";
import { useProfile } from "../hooks/useProfile";
import { NOUN_TOKEN_ADDRESS, shortenAddress } from "../utils/address";
import { CountdownDisplay } from "./CountdownDisplay";
import { format, fromUnixTime } from "date-fns";
import { EtherscanPageType, getEtherscanLink } from "../utils/url";
import { Text } from "../elements/Text";
import { useAuction } from "../hooks/useAuction";
import { ArrowUpRight } from "react-feather";

type AuctionRowProps = {
  auction: Auction;
};

export function AuctionRow({ auction: initialAuction }: AuctionRowProps) {
  const { auction = initialAuction } = useAuction(initialAuction.noun.id, {
    fallbackData: initialAuction,
    ...(!initialAuction.settled && {
      refreshInterval: 5000,
    }),
  });
  const { noun, imageURL } = useNoun(auction.noun.id, {
    fallbackData: auction.noun,
  });
  const { ensName: ownerENSName, avatarURI: ownerAvatarURI } = useProfile(
    noun.owner.address
  );
  const { ensName: bidderENSName } = useProfile(auction.bidder.address);

  return (
    <Box>
      <Box display="grid" className={auctionHero} paddingY="6" marginBottom="3">
        <Box>
          <Text variant="label" marginBottom="2">
            {format(fromUnixTime(auction.startTime), "MMMM dd, yy")}
          </Text>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Box
              as="img"
              width="7"
              height="7"
              src={imageURL || "../assets/loading-skull-noun.gif"}
              alt={`Noun ${auction.noun.id}`}
              marginRight="2.5"
            />
            <Text
              variant="extraLarge"
              color={auction.settled ? "text" : "yellow"}
              lineHeight="none"
            >
              NOUN {auction.noun.id}
            </Text>
            <ArrowUpRight color={vars.colors.yellow} size={24} />
          </Box>
        </Box>
        <Box>
          <Text variant="label" marginBottom="2">
            {auction.settled ? "Winning Bid" : "Current Bid"}
          </Text>
          <Text
            variant={auction.settled ? "medium" : "large"}
            color={auction.settled ? "text" : "yellow"}
            marginBottom="1"
          >
            ETH {toFixed(formatEther(auction.amount), 2)}
          </Text>
          <Text
            color="textSecondary"
            weight="medium"
            transform={bidderENSName || ownerENSName ? "uppercase" : undefined}
          >
            {auction.settled
              ? ownerENSName || shortenAddress(noun.owner.address)
              : bidderENSName || shortenAddress(auction.bidder.address)}
          </Text>
        </Box>
        {auction.settled ? (
          <Box>
            <Text variant="label" marginBottom="2">
              Holder
            </Text>
            <Box>
              <Box display="flex" alignItems="center" marginBottom="1">
                {ownerAvatarURI ? (
                  <Avatar
                    label="Avatar"
                    src={ownerAvatarURI}
                    size="3"
                    shape="square"
                  />
                ) : (
                  <Box
                    width="3"
                    height="3"
                    backgroundColor="yellow"
                    borderRadius="medium"
                  />
                )}
                <Text variant="medium" marginLeft="2.5">
                  {ownerENSName || shortenAddress(noun.owner.address)}
                </Text>
              </Box>
              <Text variant="small" color="textSecondary" transform="uppercase">
                <a
                  rel="noreferrer"
                  href={getEtherscanLink(
                    EtherscanPageType.TOKEN,
                    NOUN_TOKEN_ADDRESS,
                    `a=${noun.owner.address}`
                  )}
                  target="_blank"
                >
                  View on Etherscan
                </a>
              </Text>
            </Box>
          </Box>
        ) : (
          <Box>
            <Text variant="label" marginBottom="2">
              Time Remaining
            </Text>
            <Text variant="large" transform="uppercase" marginBottom="1">
              <CountdownDisplay to={auction.endTime} />
            </Text>
            <Text transform="uppercase" color="textSecondary" weight="medium">
              {format(fromUnixTime(auction.endTime), "PP h:mm a")}
            </Text>
          </Box>
        )}
      </Box>
      <BidTable bids={auction.bids} />
    </Box>
  );
}
