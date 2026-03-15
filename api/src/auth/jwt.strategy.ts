import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  platformRole?: string;
  orgUserId?: string;
  organizationId?: string;
  organizationRole?: string;
  businessRole?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'pharmaflow-secret-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      platformRole: payload.platformRole,
      orgUserId: payload.orgUserId,
      organizationId: payload.organizationId,
      organizationRole: payload.organizationRole,
      businessRole: payload.businessRole,
    };
  }
}
