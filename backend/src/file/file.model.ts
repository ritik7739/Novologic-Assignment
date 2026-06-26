import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WorkbookFile {
  @Field(() => ID)
  id: string;

  @Field()
  workbookId: string;

  @Field()
  name: string;

  @Field()
  mimeType: string;

  @Field(() => Int)
  size: number;

  @Field()
  storageKey: string;

  @Field()
  createdAt: Date;
}
