import { Box } from "degen";
import { Text } from "../elements/Text";

export function Header() {
  return (
    <Box
      as="header"
      paddingY="2"
      marginBottom="4"
      borderBottomWidth="0.5"
      borderColor="white"
    >
      <Box paddingX="4" display="flex" justifyContent="flex-start">
        <Text variant="base" transform="uppercase" weight="bold">
          Nounsverse.wtf
        </Text>
      </Box>
    </Box>
  );
}
