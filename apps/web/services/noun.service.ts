export type Account = {
  address: string;
  tokenBalanceRaw: string;
};

export type Bid = {
  id: string;
  bidder: Account;
  blockNumber: number;
  blockTimestamp: number;
  amount: string;
};

export type Noun = {
  id: string;
};

export type Auction = {
  endTime: string;
  noun: Noun;
  bids: Bid[];
};

export type GetBidOptions = {
  address?: string;
};

/*
 * NounsService
 * Reusable service interface to allow multiple backend
 * as more nounsapi's are build without massive refactor
 */
export interface NounService {
  getAuction(nounId: string): Promise<Auction>;
  getAuctions(
    order: "DESC" | "ASC",
    limit: number,
    offset: number
  ): Promise<Auction[]>;
  getBids(opts: GetBidOptions): Promise<Bid[]>;
}
