import { Page } from "../components/Page";
import { Box } from "degen";
import { NounImage } from "../components/AuctionRow.css";

export function FallbackPage() {
  return (
    <Page>
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="viewHeight"
        width="viewWidth"
      >
        <Box
          as="img"
          className={NounImage}
          src="../assets/loading-skull-noun.gif"
          alt="Loading Noun"
        />
      </Box>
    </Page>
  );
}
