import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PlayerEntity = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().player;
});
