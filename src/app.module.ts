import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlConfig } from './config/graphql.config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig)
    // GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
