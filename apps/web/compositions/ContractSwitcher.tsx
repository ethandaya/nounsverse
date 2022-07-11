import { Text } from "../elements/Text";
import {
  isAddressMatch,
  LIL_NOUN_TOKEN_ADDRESS,
  NOUN_TOKEN_ADDRESS,
  shortenAddress,
} from "../utils/address";
import { Box, IconRefresh } from "degen";
import React from "react";
import { useServiceContext } from "../hooks/useServiceContext";
import {
  ContractSwitcherRoot,
  RefreshIconSpinner,
} from "./ContractSwitcher.css";

const options = [
  { address: NOUN_TOKEN_ADDRESS, label: "NOUNS" },
  {
    address: LIL_NOUN_TOKEN_ADDRESS,
    label: "LIL NOUNS",
  },
];

type ContractSwitcherProps = {
  isWorking: boolean;
};

export function ContractSwitcher({ isWorking }: ContractSwitcherProps) {
  const { address, setAddress } = useServiceContext();

  return (
    <Box className={ContractSwitcherRoot}>
      <Box display="flex" flexDirection="row" alignItems="center" gap="2">
        {options.map((option, idx) => (
          <Text
            key={idx}
            weight="bold"
            cursor="default"
            color={
              isAddressMatch(address, option.address)
                ? "yellow"
                : "textSecondary"
            }
            onClick={() => setAddress(option.address)}
          >
            {option.label}
          </Text>
        ))}
        {isWorking && (
          <Box className={RefreshIconSpinner}>
            <IconRefresh size="2" color="textTertiary" />
          </Box>
        )}
      </Box>
      <Text color="textSecondary" weight="medium">
        {shortenAddress(address)}
      </Text>
    </Box>
  );
}
