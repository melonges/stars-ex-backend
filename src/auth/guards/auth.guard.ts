import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../auth.types';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PlayerService } from 'src/player/player.service';
import { SHOULD_SKIP_INJECT_PLAYER } from '../decorators/skip-inject-player.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<AuthConfig>,
    private reflector: Reflector,
    private playerService: PlayerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      request['playerId'] = payload.sub;

      const shouldSkipInjectPlayer = this.reflector.getAllAndOverride<boolean>(
        SHOULD_SKIP_INJECT_PLAYER,
        [context.getHandler(), context.getClass()],
      );

      if (shouldSkipInjectPlayer) {
        return this.playerService.isExists(payload.sub);
      }

      const player = await this.playerService.getPlayer(payload.sub);
      if (!player) {
        return false;
      }
      request['player'] = player;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
