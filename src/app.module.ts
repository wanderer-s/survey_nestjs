import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlConfig } from './config/graphql.config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      ...graphqlConfig
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    AuthModule,
    SurveyModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
