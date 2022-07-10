import { style } from "@vanilla-extract/css";
import { vars } from "degen";

export const blockNumberCol = style({
  textDecoration: "underline",
  textTransform: "uppercase",
  color: vars.colors.textSecondary,
  fontFamily: vars.fonts.mono,
});
