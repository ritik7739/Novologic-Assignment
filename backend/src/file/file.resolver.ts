import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { UploadFileInput } from './dto/upload-file.input';
import { WorkbookFile } from './file.model';
import { FileService } from './file.service';

@Resolver(() => WorkbookFile)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => WorkbookFile)
  uploadFileMetadata(
    @Args('workbookId') workbookId: string,
    @Args('name') name: string,
    @Args('mimeType') mimeType: string,
    @Args('size', { type: () => Int }) size: number,
    @Args('storageKey') storageKey: string,
  ) {
    const input: UploadFileInput = { workbookId, name, mimeType, size, storageKey };
    return this.fileService.createMetadata(input);
  }

  @Mutation(() => Boolean)
  deleteFile(@Args('fileId') fileId: string) {
    return this.fileService.delete(fileId);
  }
}
