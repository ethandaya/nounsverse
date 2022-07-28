import { gql } from "graphql-request";

export const ACCOUNT_FRAGMENT = gql`
  fragment AccountFragment on Account {
    address: id
    tokenBalanceRaw
  }
`;

export const BID_FRAGMENT = gql`
  fragment BidFragment on Bid {
    id
    amount
    blockNumber
    blockIndex: txIndex
    blockTimestamp
    bidder {
      ...AccountFragment
    }
  }
  ${ACCOUNT_FRAGMENT}
`;

export const NOUN_FRAGMENT = gql`
  fragment NounFragment on Noun {
    id
    owner {
      ...AccountFragment
    }
  }
  ${ACCOUNT_FRAGMENT}
`;

export const AUCTION_FRAGMENT = gql`
  fragment AuctionFragment on Auction {
    noun {
      ...NounFragment
    }
    amount
    settled
    startTime
    endTime
    bids {
      ...BidFragment
    }
    bidder {
      ...AccountFragment
    }
  }
  ${BID_FRAGMENT}
  ${NOUN_FRAGMENT}
  ${ACCOUNT_FRAGMENT}
`;
