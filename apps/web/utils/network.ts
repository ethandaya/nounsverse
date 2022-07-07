import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is a required env var");
}

export const { chains, provider } = configureChains(
  [chain.mainnet],
  [alchemyProvider({ alchemyId: ALCHEMY_API_KEY })]
);

const { connectors } = getDefaultWallets({
  appName: "Nounspro",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
