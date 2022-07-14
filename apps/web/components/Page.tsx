import Head from "next/head";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../utils/seo";
import React from "react";
import { Box } from "degen";

type PageProps = {
  title?: string;
  description?: string;
  image?: string;
  children: React.ReactNode;
};

const SITE_IMAGE = `${SITE_URL}/ogImage.jpg`;

export function Page({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  image = SITE_IMAGE,
  children,
}: PageProps) {
  return (
    <Box>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} key="title" />
        <meta
          name="og:description"
          property="og:description"
          content={description}
        />
        <meta property="og:site_name" content={title} />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content={SITE_URL} />
        <meta name="twitter:creator" content="@ethandaya" />

        <link rel="icon" type="image/png" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />

        <meta property="og:image" content={image} />
        <meta name="twitter:image" content={image} />
      </Head>
      {children}
    </Box>
  );
}
