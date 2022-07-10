import { style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { atoms, vars } from "degen";

const variant = {
  extraLarge: style([
    atoms({
      fontSize: "headingOne",
    }),
    style({
      fontWeight: "900",
    }),
  ]),
  large: style([
    atoms({
      fontSize: "headingTwo",
    }),
    style({
      fontWeight: "700",
    }),
  ]),
  medium: style([
    atoms({
      fontSize: "extraLarge",
    }),
    style({
      fontWeight: "700",
    }),
  ]),
  base: atoms({
    fontSize: "base",
    fontWeight: "normal",
  }),
  small: style([
    atoms({
      fontSize: "small",
      fontWeight: "normal",
    }),
    style({
      lineHeight: "1.5rem",
    }),
  ]),
  label: style([
    atoms({
      color: "textTertiary",
      fontSize: "label",
      fontWeight: "medium",
      textTransform: "uppercase",
    }),
    style({
      letterSpacing: "0.1em",
    }),
  ]),
};

export const variants = recipe({
  base: {
    fontFamily: vars.fonts.mono,
  },
  variants: {
    variant,
    ellipsis: {
      true: style([
        style({
          textOverflow: "ellipsis",
        }),
        atoms({
          overflow: "hidden",
          whiteSpace: "nowrap",
        }),
      ]),
    },
  },
});

export type TextVariants = RecipeVariants<typeof variants>;
