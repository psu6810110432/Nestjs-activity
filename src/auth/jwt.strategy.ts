import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mySuperSecretKey123', // ต้องตรงกับใน Module
    });
  }

  async validate(payload: any) {
    // ข้อมูลใน payload คือสิ่งที่เราใส่ไว้ตอนสร้าง Token (เช่น userId, username)
    return { userId: payload.sub, username: payload.username , role: payload.role};
  }
}