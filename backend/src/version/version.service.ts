import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

function toPrismaJson(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

@Injectable()
export class VersionService {
  constructor(private readonly prisma: PrismaService) {}

  findByWorkbook(workbookId: string) {
    return this.prisma.workbookVersion.findMany({
      where: { workbookId },
      orderBy: { savedAt: 'desc' },
    });
  }

  async recordVersion(workbookId: string, content: unknown) {
    const version = await this.prisma.workbookVersion.create({
      data: { workbookId, content: toPrismaJson(content) },
    });

    await this.deleteOldVersions(workbookId);
    return version;
  }

  async restore(versionId: string) {
    const version = await this.prisma.workbookVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) {
      throw new NotFoundException('Workbook version not found');
    }

    const workbook = await this.prisma.workbook.update({
      where: { id: version.workbookId },
      data: { content: toPrismaJson(version.content) },
      include: { files: true },
    });

    await this.recordVersion(workbook.id, workbook.content);
    return workbook;
  }

  private async deleteOldVersions(workbookId: string) {
    const versions = await this.prisma.workbookVersion.findMany({
      where: { workbookId },
      orderBy: { savedAt: 'desc' },
      skip: 5,
      select: { id: true },
    });

    if (versions.length === 0) {
      return;
    }

    await this.prisma.workbookVersion.deleteMany({
      where: { id: { in: versions.map((workbookVersion: { id: string }) => workbookVersion.id) } },
    });
  }
}
