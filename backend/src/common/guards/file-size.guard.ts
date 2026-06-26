import { CanActivate, ExecutionContext, Injectable, PayloadTooLargeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileSizeGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { headers: Record<string, string> }>();
    const contentLength = Number(request.headers['content-length'] ?? 0);
    const maxMb = Number(this.configService.get('MAX_FILE_SIZE_MB') ?? 10);
    const maxBytes = maxMb * 1024 * 1024;

    if (contentLength > maxBytes) {
      throw new PayloadTooLargeException(`File upload must be ${maxMb}MB or smaller`);
    }

    return true;
  }
}
