import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JsonScalar } from './common/scalars/json.scalar';
import { FileModule } from './file/file.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { VersionModule } from './version/version.module';
import { WorkbookModule } from './workbook/workbook.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(process.cwd(), configService.get('UPLOAD_DIR') ?? 'uploads'),
          serveRoot: '/uploads',
        },
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
    }),
    PrismaModule,
    UserModule,
    WorkbookModule,
    FileModule,
    VersionModule,
  ],
  providers: [JsonScalar],
})
export class AppModule {}
