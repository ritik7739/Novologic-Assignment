import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { constants } from 'fs';
import { access, unlink } from 'fs/promises';
import { basename, resolve } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileInput } from './dto/upload-file.input';

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createMetadata(input: UploadFileInput) {
    const workbook = await this.prisma.workbook.findUnique({ where: { id: input.workbookId } });

    if (!workbook) {
      throw new NotFoundException('Workbook not found');
    }

    return this.prisma.file.create({ data: input });
  }

  async delete(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.deleteUploadedFile(file.storageKey);
    await this.prisma.file.delete({ where: { id: fileId } });
    return true;
  }

  private async deleteUploadedFile(storageKey: string) {
    const uploadDir = resolve(process.cwd(), this.configService.get('UPLOAD_DIR') ?? 'uploads');
    const filename = basename(storageKey);
    const filePath = resolve(uploadDir, filename);

    if (!filePath.startsWith(`${uploadDir}/`) && filePath !== uploadDir) {
      return;
    }

    try {
      await access(filePath, constants.F_OK);
      await unlink(filePath);
    } catch (error) {
      if (this.isMissingFileError(error)) {
        return;
      }

      throw error;
    }
  }

  private isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && 'code' in error && error.code === 'ENOENT';
  }
}
