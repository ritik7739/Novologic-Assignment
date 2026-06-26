import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { WorkbookFile } from '../file/file.model';
import { WorkbookVersion } from '../version/version.model';

@ObjectType()
export class Workbook {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => GraphQLJSONObject)
  content: Record<string, unknown>;

  @Field(() => [WorkbookFile], { defaultValue: [] })
  files: WorkbookFile[];

  @Field(() => [WorkbookVersion], { defaultValue: [] })
  versions?: WorkbookVersion[];

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}
