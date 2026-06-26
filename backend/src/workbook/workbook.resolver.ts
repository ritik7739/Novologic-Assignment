import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Workbook } from './workbook.model';
import { WorkbookService } from './workbook.service';

@Resolver(() => Workbook)
export class WorkbookResolver {
  constructor(private readonly workbookService: WorkbookService) {}

  @Query(() => Workbook)
  workbook(@Args('userId') userId: string) {
    return this.workbookService.findByUser(userId);
  }

  @Mutation(() => Workbook)
  saveWorkbook(
    @Args('workbookId') workbookId: string,
    @Args('content', { type: () => GraphQLJSONObject }) content: Record<string, unknown>,
  ) {
    return this.workbookService.save(workbookId, content);
  }
}
