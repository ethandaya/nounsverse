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
import { format, fromUnixTime, isPast } from "date-fns";
import { EtherscanPageType, getEtherscanLink } from "../utils/url";
import { Text } from "../elements/Text";
import { useAuction } from "../hooks/useAuction";
import { ArrowUpRight } from "react-feather";
import { useServiceContext } from "../hooks/useServiceContext";
import { useMemo } from "react";

type AuctionRowProps = {
  auction: Auction;
};

export function AuctionRow({ auction: initialAuction }: AuctionRowProps) {
  const { config } = useServiceContext();
  const { auction = initialAuction } = useAuction(initialAuction.noun.id, {
    fallbackData: initialAuction,
    ...(!initialAuction.settled && {
      refreshInterval: 1000 * 30,
    }),
  });

  const { noun, imageURL } = useNoun(auction.noun.id, {
    fallbackData: auction.noun,
  });
  const { ensName: ownerENSName, avatarURI: ownerAvatarURI } = useProfile(
    noun.owner.address
  );
  const { ensName: bidderENSName } = useProfile(auction.bidder?.address);

  const isEnded = useMemo(
    () => isPast(fromUnixTime(auction.endTime)),
    [auction]
  );

  return (
    <Box>
      <Box display="grid" className={auctionHero} paddingY="6" marginBottom="3">
        <Box>
          <Text variant="label" marginBottom="2">
            {format(fromUnixTime(auction.startTime), "MMMM dd, yy")}
          </Text>
          <a
            href={`${config.externalBaseURI}/${auction.noun.id}`}
            target="_blank"
            rel="noreferrer"
          >
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
                width="auto"
              >
                NOUN {auction.noun.id}
              </Text>
              <ArrowUpRight color={vars.colors.yellow} size={24} />
            </Box>
          </a>
        </Box>
        <Box>
          <Text variant="label" marginBottom="2">
            {auction.settled
              ? "Winning Bid"
              : auction.bidder
              ? isEnded
                ? "Winning Bid"
                : "Current Bid"
              : "Reserve Not met"}
          </Text>
          <Text
            variant={auction.settled ? "medium" : "large"}
            color={auction.settled ? "text" : "yellow"}
            marginBottom="1"
          >
            ETH {toFixed(formatEther(auction.amount), 2)}
          </Text>
          <a
            href={getEtherscanLink(
              EtherscanPageType.ADDRESS,
              auction.settled
                ? ownerENSName || noun.owner.address
                : auction.bidder
                ? bidderENSName || auction.bidder.address
                : undefined
            )}
            target="_blank"
            rel="noreferrer"
          >
            <Text
              color="textSecondary"
              weight="medium"
              transform={
                bidderENSName || ownerENSName ? "uppercase" : undefined
              }
            >
              {auction.settled
                ? ownerENSName || shortenAddress(noun.owner.address)
                : auction?.bidder
                ? bidderENSName || shortenAddress(auction.bidder.address)
                : "NO BIDS YET"}
            </Text>
          </a>
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
                <Text
                  variant="medium"
                  marginLeft="1.5"
                  transform={ownerENSName ? "uppercase" : undefined}
                >
                  {ownerENSName || shortenAddress(noun.owner.address)}
                </Text>
              </Box>

              <Box
                as="a"
                display="flex"
                alignItems="center"
                rel="noreferrer"
                href={getEtherscanLink(
                  EtherscanPageType.TOKEN,
                  NOUN_TOKEN_ADDRESS,
                  `a=${noun.owner.address}`
                )}
                target="_blank"
              >
                <Text
                  underline="hover"
                  color="textSecondary"
                  transform="uppercase"
                  marginRight="0.5"
                >
                  View on Etherscan
                </Text>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Text variant="label" marginBottom="2">
              {isEnded ? "Auction Ended" : "Time Remaining"}
            </Text>
            <Text
              variant="large"
              transform="uppercase"
              marginBottom="1"
              color={isEnded ? "textTertiary" : "text"}
            >
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
