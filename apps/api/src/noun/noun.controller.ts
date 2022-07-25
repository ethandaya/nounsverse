import { Controller, Get, Logger, Param } from '@nestjs/common';
import { NounService } from './noun.service';
import { getAddress } from '@ethersproject/address';

@Controller('noun')
export class NounController {
  logger: Logger = new Logger(NounController.name);

  constructor(private readonly nounService: NounService) {}

  @Get('/:tokenAddress/:tokenId/auction')
  public async getAuction(
    @Param('tokenAddress') tokenAddress: string,
    @Param('tokenId') tokenId: string,
  ) {
    this.logger.log(`Fetching metadata for ${tokenAddress}:${tokenId}`);
    return this.nounService.fetchAuction(getAddress(tokenAddress), tokenId);
  }

  // TODO - add a isnounish check for now
  @Get('/:tokenAddress/:tokenId')
  public async getMetadata(
    @Param('tokenAddress') tokenAddress: string,
    @Param('tokenId') tokenId: string,
  ) {
    this.logger.log(`Fetching metadata for ${tokenAddress}:${tokenId}`);
    return this.nounService.fetchOrGet(getAddress(tokenAddress), tokenId);
  }
}
