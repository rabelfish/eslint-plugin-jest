import {
  createRule,
  getStringValue,
  hasExpressions,
  isDescribe,
  isStringNode,
  isTemplateLiteral,
  isTestCase,
} from './tsUtils';

export default createRule({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow empty titles',
      recommended: false,
    },
    messages: {
      describe: 'describe should not have an empty title',
      test: 'test should not have an empty title',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (!isDescribe(node) && !isTestCase(node)) {
          return;
        }
        const [firstArgument] = node.arguments;
        if (!isStringNode(firstArgument)) {
          return;
        }
        if (isTemplateLiteral(firstArgument) && hasExpressions(firstArgument)) {
          return;
        }
        if (getStringValue(firstArgument) === '') {
          context.report({
            messageId: isDescribe(node) ? 'describe' : 'test',
            node,
          });
        }
      },
    };
  },
});
