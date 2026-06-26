import { Module } from '@nestjs/common';
import { VersionResolver } from './version.resolver';
import { VersionService } from './version.service';

@Module({
  providers: [VersionResolver, VersionService],
  exports: [VersionService],
})
export class VersionModule {}
