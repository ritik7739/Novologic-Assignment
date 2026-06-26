import { Module } from '@nestjs/common';
import { VersionModule } from '../version/version.module';
import { WorkbookResolver } from './workbook.resolver';
import { WorkbookService } from './workbook.service';

@Module({
  imports: [VersionModule],
  providers: [WorkbookResolver, WorkbookService],
  exports: [WorkbookService],
})
export class WorkbookModule {}
