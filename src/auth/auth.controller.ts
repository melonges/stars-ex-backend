import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TelegramInitDataDto } from './dto/telegram-init-data.dto';
import { Public } from './decorators/public.decorator';
import { AccessTokenDto } from './dto/access-token.dto';
import {
  ApiBadRequestResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBadRequestResponse()
  @Public()
  @Post('login')
  signIn(@Body() signInDto: TelegramInitDataDto): Promise<AccessTokenDto> {
    return this.authService.signIn(signInDto.initData);
  }

  @Public()
  @ApiExcludeEndpoint(process.env.NODE_ENV !== 'development')
  @Get('generateDevJwt/:id')
  generateDevJwt(@Param('id') id: number) {
    if (process.env.NODE_ENV === 'development') {
      return this.authService.generateDevJwt(+id);
    }
    throw new NotFoundException();
  }
}
