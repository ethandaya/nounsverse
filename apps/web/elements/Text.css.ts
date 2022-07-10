import { style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { atoms, vars } from "degen";

const variant = {
  extraLarge: style([
    atoms({
      color: "text",
      fontSize: "headingOne",
    }),
    style({
      fontWeight: "900",
    }),
  ]),
  large: style([
    atoms({
      color: "text",
      fontSize: "large",
      fontWeight: "normal",
    }),
    style({
      lineHeight: "2rem",
    }),
  ]),
  base: atoms({
    color: "text",
    fontSize: "base",
    fontWeight: "normal",
  }),
  small: style([
    atoms({
      color: "text",
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
      marginBottom: vars.space["1"],
    }),
  ]),
};

export const TextCss = recipe({
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

export type TextVariants = RecipeVariants<typeof TextCss>;
