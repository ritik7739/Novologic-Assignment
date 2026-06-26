import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SaveWorkbookInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  workbookId: string;

  @Field(() => GraphQLJSONObject)
  content: Record<string, unknown>;
}
