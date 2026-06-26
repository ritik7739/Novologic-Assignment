import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { VersionService } from '../version/version.service';

function toPrismaJson(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

@Injectable()
export class WorkbookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly versionService: VersionService,
  ) {}

  async findByUser(userId: string) {
    const workbook = await this.prisma.workbook.findFirst({
      where: { userId },
      include: { files: { orderBy: { createdAt: 'desc' } } },
      orderBy: { updatedAt: 'desc' },
    });

    if (!workbook) {
      throw new NotFoundException('Workbook not found');
    }

    return workbook;
  }

  async save(workbookId: string, content: Record<string, unknown>) {
    const workbook = await this.prisma.workbook.update({
      where: { id: workbookId },
      data: { content: toPrismaJson(content) },
      include: { files: { orderBy: { createdAt: 'desc' } } },
    });

    await this.versionService.recordVersion(workbook.id, content);
    return workbook;
  }
}
