import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Like JwtAuthGuard but never throws: sets req.user when a valid token is
 * present, leaves it undefined when there is none.  Use on public endpoints
 * that should still recognise authenticated callers.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest<TUser = any>(_err: unknown, user: TUser): TUser {
    return user; // undefined / null is fine — no exception thrown
  }
}
