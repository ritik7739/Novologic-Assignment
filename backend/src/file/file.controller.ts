import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { FileSizeGuard } from '../common/guards/file-size.guard';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']);
const uploadDir = process.env.UPLOAD_DIR ?? './uploads';

@Controller()
export class FileController {
  constructor(private readonly configService: ConfigService) {}

  @Post('upload')
  @UseGuards(FileSizeGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          mkdirSync(uploadDir, { recursive: true });
          callback(null, uploadDir);
        },
        filename: (_request, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_request, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
          callback(new BadRequestException('Only images and PDF files are supported'), false);
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE_MB ?? 10) * 1024 * 1024,
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Body('workbookId') workbookId?: string) {
    if (!workbookId) {
      throw new BadRequestException('Workbook id is required');
    }

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const storageKey = `/uploads/${file.filename}`;
    return {
      workbookId,
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storageKey,
      url: `${this.configService.get('PUBLIC_URL') ?? ''}${storageKey}`,
    };
  }
}
