import { keyframes, style } from "@vanilla-extract/css";
import { motionSafe } from "degen";
import { mq } from "../utils/breakpoints";

const rotate = keyframes({
  "100%": { transform: "rotate(1turn)" },
});

export const RefreshIconSpinner = style({
  ...motionSafe({
    animation: `1.4s linear infinite ${rotate}`,
  }),
});

export const ContractSwitcherRoot = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  "@media": {
    [mq("sm")]: {
      gridTemplateColumns: "repeat(2, 50%)",
    },
  },
});
