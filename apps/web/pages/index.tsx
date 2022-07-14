import type { NextPage } from "next";
import React from "react";
import { ViewAuctionsTemplate } from "../templates/ViewAuctions";
import { ServiceCtxProvider } from "../services/ServiceContext";
import { useRouter } from "next/router";
import { getStaticAuctionProps, StaticProps } from "../services/static";
import { Page } from "../components/Page";
import { FallbackPage } from "../templates/FallbackPage";

const ViewNouns: NextPage<StaticProps> = ({
  initialPage,
  nounAddress,
  config,
}) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <FallbackPage />;
  }

  return (
    <Page>
      <ServiceCtxProvider
        key={nounAddress}
        address={nounAddress}
        config={config}
      >
        <ViewAuctionsTemplate initialPage={initialPage} />
      </ServiceCtxProvider>
    </Page>
  );
};

export const getStaticProps = getStaticAuctionProps;

export default ViewNouns;
