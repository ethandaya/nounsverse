import { Avatar, Box, Heading } from "degen";
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

type AuctionRowProps = {
  auction: Auction;
};

export function AuctionRow({ auction }: AuctionRowProps) {
  const { noun } = useNoun(auction.noun.id, {
    fallbackData: auction.noun,
  });
  const { ensName: ownerENSName, avatarURI: ownerAvatarURI } = useProfile(
    noun.owner.address
  );
  const { ensName: bidderENSName, avatarURI: bidderAvatarURI } = useProfile(
    noun.owner.address
  );

  return (
    <Box>
      <Box display="grid" className={auctionHero} paddingY="6">
        <Box>
          <Text variant="label">
            {format(fromUnixTime(auction.startTime), "MMMM dd, yy")}
          </Text>
          <Text
            variant="extraLarge"
            color={auction.settled ? "text" : "yellow"}
          >
            NOUN {auction.noun.id}
          </Text>
        </Box>
        <Box>
          <Text variant="label">
            {auction.settled ? "Winning Bid" : "Current Bid"}
          </Text>
          <Heading>{toFixed(formatEther(auction.amount), 2)}</Heading>
          <Text>
            {auction.settled
              ? ownerENSName || shortenAddress(noun.owner.address)
              : bidderENSName || shortenAddress(auction.bidder.address)}
          </Text>
        </Box>
        {auction.settled ? (
          <Box>
            <Text variant="label">Holder</Text>
            <Box>
              {bidderAvatarURI ? (
                <Avatar
                  label="Avatar"
                  src={bidderAvatarURI}
                  size="12"
                  shape="square"
                />
              ) : (
                <Box
                  width="12"
                  height="12"
                  backgroundColor="yellow"
                  borderRadius="2xLarge"
                />
              )}
              <Heading>
                {ownerENSName || shortenAddress(noun.owner.address)}
              </Heading>

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
            </Box>
          </Box>
        ) : (
          <Box>
            <Text variant="label">Time Remaining</Text>
            <Heading>
              <CountdownDisplay to={auction.endTime} />
            </Heading>
            <Text variant="small" textTransform="uppercase">
              Ends at {format(fromUnixTime(auction.endTime), "PP h:mm a")}
            </Text>
          </Box>
        )}
      </Box>
      <BidTable bids={auction.bids} />
    </Box>
  );
}
