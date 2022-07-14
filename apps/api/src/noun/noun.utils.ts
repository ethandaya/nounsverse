import { Prisma } from '@prisma/client';
import { CollectionCreateSchema } from 'typesense/src/Typesense/Collections';

export const nounSchema: CollectionCreateSchema = {
  name: 'nouns',
  fields: [
    { name: 'tokenId', type: 'string' },
    { name: 'tokenAddress', type: 'string' },
    { name: 'attribute_background', type: 'string' },
    { name: 'attribute_body', type: 'string' },
    { name: 'attribute_accessory', type: 'string' },
    { name: 'attribute_head', type: 'string' },
    { name: 'attribute_glasses', type: 'string' },
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
