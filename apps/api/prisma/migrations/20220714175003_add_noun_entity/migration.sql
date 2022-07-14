-- CreateTable
CREATE TABLE "Noun" (
    "tokenId" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "tokenURI" TEXT NOT NULL,
    "tokenURL" TEXT NOT NULL,
    "tokenURLMimeType" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "contentURL" TEXT,
    "contentURLMimeType" TEXT,
    "imageURL" TEXT,
    "imageURLMimeType" TEXT,
    "externalLink" TEXT,
    "attributes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Noun_pkey" PRIMARY KEY ("tokenId","tokenAddress")
);
