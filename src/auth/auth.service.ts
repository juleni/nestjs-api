import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // Generate password hash
    const hash = await argon.hash(dto.password);

    // Save new user in DB
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // Delete hash from user object
      delete user.hash;
      // Return the saved user
      return user;
    } catch (error) {
      if (
        // Duplicate record error
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Email already used');
      } else throw error;
    }
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // If user does not exist - throw exception
    if (!user) throw new ForbiddenException('Incorrect credentials / email');

    // Compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // If the password is incorrect - throw exception
    if (!pwMatches) throw new ForbiddenException('Incorrect credentials / pwd');

    // Delete hash from user object
    delete user.hash;
    // Return user
    return user;
  }
}
