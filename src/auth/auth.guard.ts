import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRequest } from './auth.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = getRequest(context);

    const authorization = req.get('Authorization');

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization?.replace(/(B|b)earer /, '');

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET
      });

      if (!payload?.id) {
        throw new UnauthorizedException();
      }

      req.userId = payload.id;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
