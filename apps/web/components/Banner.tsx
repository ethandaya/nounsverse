import Marquee from "react-fast-marquee";
import { Text } from "../elements/Text";
import { SITE_DESCRIPTION } from "../utils/seo";
import { MarqueeRoot } from "./Banner.css";
import { Box } from "degen";

export function Banner() {
  return (
    <Box position="fixed" bottom="0" left="0" right="0">
      <Marquee className={MarqueeRoot} pauseOnHover gradient={false} speed={60}>
        <Box display="flex" gap="3" flexDirection="row" alignItems="center">
          <Text transform="uppercase" color="black" padding="1.5">
            {SITE_DESCRIPTION}
          </Text>
          <Text color="black" padding="1.5">
            —
          </Text>
          <Text color="black" transform="uppercase">
            Github
          </Text>
          <Text color="black" padding="1.5">
            —
          </Text>
          <Text transform="uppercase" color="black" padding="1.5">
            {SITE_DESCRIPTION}
          </Text>
        </Box>
      </Marquee>
    </Box>
  );
}
