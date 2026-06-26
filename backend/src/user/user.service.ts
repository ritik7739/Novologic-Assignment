import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async firstUser() {
    const user = await this.prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });

    if (!user) {
      throw new NotFoundException('No seeded user found');
    }

    return user;
  }

  create(input: CreateUserInput) {
    return this.prisma.user.create({ data: input });
  }
}
