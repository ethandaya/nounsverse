export type Noun = {
  id: string;
};

export type Auction = {
  noun: Noun;
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
}
