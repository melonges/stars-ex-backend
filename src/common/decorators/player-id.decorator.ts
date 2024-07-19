import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const PlayerId = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().playerId;
});
