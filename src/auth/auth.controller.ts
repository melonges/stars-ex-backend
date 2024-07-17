import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TelegramInitDataDto } from './dto/telegram-init-data.dto';
import { Public } from './decorators/public.decorator';
import { AccessTokenDto } from './dto/access-token.dto';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBadRequestResponse()
  @Public()
  @Post('login')
  signIn(@Body() signInDto: TelegramInitDataDto): Promise<AccessTokenDto> {
    return this.authService.signIn(signInDto.string);
  }
}
