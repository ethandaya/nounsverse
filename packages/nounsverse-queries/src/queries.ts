import { gql } from "graphql-request";
import { AUCTION_FRAGMENT, BID_FRAGMENT, NOUN_FRAGMENT } from "./fragments";

export const GET_NOUN_BY_ID = gql`
  query GetNounById($nounId: ID!) {
    noun(id: $nounId) {
      ...NounFragment
    }
  }
  ${NOUN_FRAGMENT}
`;

export const GET_AUCTION_BY_ID = gql`
  query GetAuctionById($id: ID!) {
    auction(id: $id) {
      ...AuctionFragment
    }
  }
  ${AUCTION_FRAGMENT}
`;

export const GET_AUCTIONS_BY_ID = gql`
  query GetAuctions($order: String, $limit: Int, $offset: Int) {
    auctions(
      orderBy: endTime
      orderDirection: $order
      first: $limit
      skip: $offset
    ) {
      ...AuctionFragment
    }
  }
  ${AUCTION_FRAGMENT}
`;

export const GET_BIDS = gql`
  query GetBids($address: String, $blockNumber: Int, $offset: Int!) {
    bids(
      where: { bidder: $address }
      block: { number: $blockNumber }
      skip: $offset
    ) {
      ...BidFragment
    }
  }
  ${BID_FRAGMENT}
`;
