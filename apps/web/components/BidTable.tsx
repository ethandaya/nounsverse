import { Bid } from "../services/interfaces/noun.service";
import { Box, vars } from "degen";
import { Text } from "../elements/Text";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { BidCard } from "./BidCard";
import { BidTableHeaderRoot } from "./BidTable.css";
import { BidRow } from "./BidRow";

type BidTableProps = {
  bids: Bid[];
};

const columns = [
  { label: "Block No." },
  { label: "Tx Hash" },
  { label: "Bidder" },
  { label: "Bid" },
  { label: "Eth Balance" },
  { label: "Prev. Bids" },
  { label: "When" },
];

export function BidTable({ bids }: BidTableProps) {
  const [showMoreBids, setShowMoreBids] = useState<boolean>(false);
  return (
    <Box marginBottom="6">
      <Box className={BidTableHeaderRoot} marginBottom="2">
        {columns.map((col, idx) => (
          <Text variant="label" key={idx}>
            {col.label}
          </Text>
        ))}
      </Box>
      {bids
        .sort((a, b) => b.blockTimestamp - a.blockTimestamp)
        .slice(0, showMoreBids ? bids.length : 5)
        .map((bid, idx) => (
          <>
            <BidRow key={idx} bid={bid} />
            <BidCard key={idx} bid={bid} />
          </>
        ))}
      {bids.length > 7 && (
        <Box
          width="auto"
          display="flex"
          alignItems="center"
          cursor="pointer"
          onClick={() => setShowMoreBids(!showMoreBids)}
        >
          <Text variant="label" marginRight="0.5">
            {showMoreBids ? "Collapse" : "View More Bids"}
          </Text>
          {showMoreBids ? (
            <ChevronUp color={vars.colors.textTertiary} size={16} />
          ) : (
            <ChevronDown color={vars.colors.textTertiary} size={16} />
          )}
        </Box>
      )}
    </Box>
  );
}
