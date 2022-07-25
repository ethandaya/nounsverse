import { Noun, Prisma } from '@prisma/client';
import { CollectionCreateSchema } from 'typesense/src/Typesense/Collections';

export const nounAndAuctionSchema: CollectionCreateSchema = {
  name: 'nouns',
  fields: [
    { name: 'tokenId', type: 'int32' },
    { name: 'tokenAddress', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'attribute_background', type: 'string', facet: true },
    { name: 'attribute_body', type: 'string', facet: true },
    { name: 'attribute_accessory', type: 'string', facet: true },
    { name: 'attribute_head', type: 'string', facet: true },
    { name: 'attribute_glasses', type: 'string', facet: true },
  ],
  default_sorting_field: 'tokenId',
};

type Attribute = {
  trait_type: string;
  value: string;
};

export function flattenAttributesForSearch(attributes: Prisma.JsonValue) {
  // TODO - you didnt see this
  const attrs = attributes as Attribute[];
  return attrs.reduce((acc, val) => {
    return {
      ...acc,
      [`attribute_${val.trait_type}`]: val.value,
    };
  }, {});
}

export function nounToTypesenseDocument(noun: Noun) {
  return {
    id: `${noun.tokenAddress}=${noun.tokenId}`,
    ...noun,
    tokenId: parseInt(noun.tokenId.toString(), 10),
    ...flattenAttributesForSearch(noun.attributes),
  };
}
