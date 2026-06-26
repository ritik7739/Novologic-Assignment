import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Workbook } from '../workbook/workbook.model';
import { WorkbookVersion } from './version.model';
import { VersionService } from './version.service';

@Resolver(() => WorkbookVersion)
export class VersionResolver {
  constructor(private readonly versionService: VersionService) {}

  @Query(() => [WorkbookVersion])
  workbookVersions(@Args('workbookId') workbookId: string) {
    return this.versionService.findByWorkbook(workbookId);
  }

  @Mutation(() => Workbook)
  restoreVersion(@Args('versionId') versionId: string) {
    return this.versionService.restore(versionId);
  }
}
