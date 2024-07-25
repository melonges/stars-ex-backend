import { Controller, Get, Query } from '@nestjs/common';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { ReferralRepository } from './referral.repository';
import { ReferralDto } from './dto/referral.dto';
import { ApiPaginatedResponse } from 'src/common/swagger/ApiPaginatedResponse';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/swagger/pagination';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Referral')
@Controller('referral')
export class ReferralController {
  constructor(private readonly referralRepository: ReferralRepository) {}

  @Get()
  @ApiPaginatedResponse(ReferralDto)
  getReferrals(
    @PlayerId() id: number,
    @Query() options: PaginationDto,
  ): Promise<PaginatedResponse<ReferralDto>> {
    debugger;
    return this.referralRepository.getReferrals(id, options);
  }
}
