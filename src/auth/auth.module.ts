import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PlayerModule } from 'src/player/player.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from './auth.types';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PlayerModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<AuthConfig>) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
