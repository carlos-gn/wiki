/* global WIKI */

module.exports = {
  Query: {
    async conversationContent() {
      return {};
    }
  },
  ConversationContentQuery: {
    async list(obj, args, context, info) {
      return WIKI.models.conversationContent.getConversationContent();
    },

    async listByAnswer(obj, args) {
      return WIKI.models.conversationContent.query().modify(queryBuilder => {
        if (args.answer) {
          queryBuilder.where({ answer: args.answer });
        }

        if (args.orderBy && args.orderByDirection) {
          queryBuilder.orderBy(args.orderBy, args.orderByDirection);
        }
      });
    }
  }
};
