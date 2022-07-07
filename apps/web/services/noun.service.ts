export type Auction = {
  nounId: string;
};

/*
 * NounsService
 * Reusable service interface to allow multiple backend
 * as more nounsapi's are build without massive refactor
 */
export interface NounService {
  getAuction(nounId: string): Promise<Auction>;
  getAuctions(order: "DESC" | "ASC", limit: number): Promise<Auction[]>;
}
