import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLScalarLiteralParser } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

@Scalar('JSON', () => Object)
export class JsonScalar implements CustomScalar<unknown, unknown> {
  description = 'Arbitrary JSON value';

  parseValue(value: unknown) {
    return GraphQLJSON.parseValue(value);
  }

  serialize(value: unknown) {
    return GraphQLJSON.serialize(value);
  }

  parseLiteral: GraphQLScalarLiteralParser<unknown> = (ast, variables) => {
    return GraphQLJSON.parseLiteral(ast, variables);
  };
}
