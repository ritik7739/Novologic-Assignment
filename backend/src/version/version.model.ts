import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class WorkbookVersion {
  @Field(() => ID)
  id: string;

  @Field()
  workbookId: string;

  @Field(() => GraphQLJSONObject)
  content: Record<string, unknown>;

  @Field()
  savedAt: Date;
}
