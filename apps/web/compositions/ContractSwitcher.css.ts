import { keyframes, style } from "@vanilla-extract/css";
import { motionSafe } from "degen";

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
  gridTemplateColumns: "repeat(2, 1fr)",
});
