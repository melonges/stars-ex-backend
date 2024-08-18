import { SetMetadata } from '@nestjs/common';

export const SHOULD_SKIP_INJECT_PLAYER = 'SHOULD_SKIP_INJECT_PLAYER';
export const SkipInjectPlayer = () =>
  SetMetadata(SHOULD_SKIP_INJECT_PLAYER, true);
