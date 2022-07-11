import Marquee from "react-fast-marquee";
import { Text } from "../elements/Text";
import { SITE_DESCRIPTION } from "../utils/seo";
import { MarqueeRoot } from "./Banner.css";
import { Box } from "degen";

const RootEl = (
  <>
    <Text marginRight="3" transform="uppercase" color="black" padding="1.5">
      {SITE_DESCRIPTION}
    </Text>
    <Text marginRight="3" color="black" padding="1.5">
      —
    </Text>
    <a
      href="https://github.com/ethandaya/nounsverse"
      target="_blank"
      rel="noreferrer"
    >
      <Text
        underline="hover"
        marginRight="3"
        color="black"
        transform="uppercase"
      >
        Github
      </Text>
    </a>

    <Text marginRight="3" color="black" padding="1.5">
      —
    </Text>
  </>
);

export function Banner() {
  return (
    <Box position="fixed" bottom="0" left="0" right="0">
      <Marquee className={MarqueeRoot} pauseOnHover gradient={false} speed={60}>
        <Box display="flex" flexDirection="row" alignItems="center">
          {RootEl}
          {RootEl}
        </Box>
      </Marquee>
    </Box>
  );
}
