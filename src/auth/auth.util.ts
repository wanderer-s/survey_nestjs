import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export function getRequest(context: ExecutionContext) {
  switch (context.getType<'graphql' | 'http'>()) {
    case 'http':
      return context.switchToHttp().getRequest();
    case 'graphql':
    default:
      return GqlExecutionContext.create(context).getContext().req;
  }
}
