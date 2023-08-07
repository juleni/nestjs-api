import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signin() {
    return { msg: 'signed in' };
  }

  signup() {
    return { msg: 'signed up' };
  }
}
