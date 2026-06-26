import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@InputType()
export class UploadFileInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  workbookId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  size: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  storageKey: string;
}
