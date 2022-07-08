import { Avatar, Box, Heading, Text } from "degen";
import { BidTable } from "./BidTable";
import { Auction } from "../services/noun.service";
import { AuctionHero } from "./AuctionRow.css";
import { toFixed } from "../utils/numbers";
import { formatEther } from "ethers/lib/utils";
import { useNoun } from "../hooks/useNoun";
import { useProfile } from "../hooks/useProfile";
import { shortenAddress } from "../utils/address";
import { CountdownDisplay, DurationDisplay } from "./CountdownDisplay";
import { format, formatDuration, fromUnixTime } from "date-fns";

type AuctionRowProps = {
  auction: Auction;
};

export function AuctionRow({ auction }: AuctionRowProps) {
  const { noun } = useNoun(auction.noun.id, {
    fallbackData: auction.noun,
  });
  const { ensName, avatarURI } = useProfile(noun.owner.address);

  return (
    <Box>
      <Box display="grid" className={AuctionHero}>
        <Heading>NOUN {auction.noun.id}</Heading>
        <Box>
          <Text variant="label">
            {auction.settled ? "Winning Bid" : "Current Bid"}
          </Text>
          <Heading>{toFixed(formatEther(auction.amount), 2)}</Heading>
        </Box>
        {auction.settled ? (
          <Box>
            <Text variant="label">Holder</Text>
            <Box>
              {avatarURI ? (
                <Avatar
                  label="Avatar"
                  src={avatarURI}
                  size="12"
                  shape="square"
                />
              ) : (
                <Box
                  width="12"
                  height="12"
                  backgroundColor="accent"
                  borderRadius="2xLarge"
                />
              )}
              <Heading>{ensName || shortenAddress(noun.owner.address)}</Heading>
            </Box>
          </Box>
        ) : (
          <Box>
            <Text variant="label">Time Remaining</Text>
            <Heading>
              <CountdownDisplay to={auction.endTime} />
            </Heading>
            <Text variant="small">
              Ends at {format(fromUnixTime(auction.endTime), "PP h:mm a")}
            </Text>
          </Box>
        )}
      </Box>
      <BidTable bids={auction.bids} />
    </Box>
  );
}
