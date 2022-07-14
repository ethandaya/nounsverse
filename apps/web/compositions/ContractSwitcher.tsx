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
import Link from "next/link";

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
  const { address } = useServiceContext();

  return (
    <Box className={ContractSwitcherRoot}>
      <Box display="flex" flexDirection="row" alignItems="center" gap="2">
        {options.map((option, idx) => (
          <Link key={option.address} href="[address]" as={`/${option.address}`}>
            <Text
              weight="bold"
              underline="hover"
              cursor="default"
              color={
                isAddressMatch(address, option.address)
                  ? "yellow"
                  : "textSecondary"
              }
            >
              {option.label}
            </Text>
          </Link>
        ))}
        {isWorking && (
          <Box className={RefreshIconSpinner}>
            <IconRefresh size="2" color="textTertiary" />
          </Box>
        )}
      </Box>
      <Text
        color="textSecondary"
        weight="medium"
        display={{
          xs: "none",
          sm: "block",
        }}
      >
        {shortenAddress(address)}
      </Text>
    </Box>
  );
}
