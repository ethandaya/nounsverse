import { Noun } from '@prisma/client';

export type CreateNounDto = Omit<Noun, 'createdAt' | 'updatedAt'>;
