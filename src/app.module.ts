import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlConfig } from './config/graphql.config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SurveyModule } from './survey/survey.module';
import { ResponseModule } from './response/response.module';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './global/filter/GraphQLExceptionFilter';
import { GraphQLError } from 'graphql/error';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      ...graphqlConfig,
      formatError: (error: GraphQLError) => {
        // @ts-ignore
        const message = error?.extensions?.originalError?.message as string
        // @ts-ignore
        const statusCode = error?.extensions?.originalError?.statusCode as number;
        const graphQLFormattedError = {
          message,
          statusCode
        };
        return graphQLFormattedError;
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    AuthModule,
    SurveyModule,
    ResponseModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter
    }
  ]
})
export class AppModule {}
