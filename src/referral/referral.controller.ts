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
import { ReferralLinkDto } from './dto/referral-link.dto';
import { ReferralService } from './referral.service';

@ApiBearerAuth()
@ApiTags('Referral')
@Controller('referral')
export class ReferralController {
  constructor(
    private readonly referralRepository: ReferralRepository,
    private referralService: ReferralService,
  ) {}

  @Get()
  @ApiPaginatedResponse(ReferralDto)
  getReferrals(
    @PlayerId() id: number,
    @Query() options: PaginationDto,
  ): Promise<PaginatedResponse<ReferralDto>> {
    return this.referralRepository.getReferrals(id, options);
  }

  @Get('link')
  getReferralLink(@PlayerId() id: number): ReferralLinkDto {
    return { link: this.referralService.getReferralLink(id) };
  }
}
