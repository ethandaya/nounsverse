import { style } from "@vanilla-extract/css";
import { mq } from "../utils/breakpoints";
import { atoms, vars } from "degen";

export const AuctionHero = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  "@media": {
    [mq("sm")]: {
      gridTemplateColumns: "1fr",
    },
    [mq("md")]: {
      gridTemplateColumns: "1fr",
    },
    [mq("lg")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    [mq("xl")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
});

export const NounTitleContainer = style({
  "@media": {
    [mq("sm", "max-width")]: {
      marginBottom: vars.space["3"],
    },
  },
});
export const NounTitleArrow = style({
  position: "absolute",
  width: "20px",
  height: "20px",
  "@media": {
    [mq("sm")]: {
      height: "24px",
      width: "24px",
    },
  },
});

export const NounTitle = style([
  style({
    flex: "0 1 auto",
    position: "relative",
    lineHeight: "0.85",
  }),
]);

export const NounImage = style([
  atoms({
    height: {
      xs: 7,
      sm: 10,
    },
    width: {
      xs: 7,
      sm: 10,
    },
  }),
  style({
    marginRight: vars.space["2.5"],
    "@media": {
      [mq("sm")]: {
        marginRight: vars.space["1"],
      },
      [mq("md")]: {
        marginRight: vars.space["1"],
      },
    },
  }),
]);

export const AuctionMetaContainer = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
});
