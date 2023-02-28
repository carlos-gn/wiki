/* global WIKI */

module.exports = {
  Query: {
    async conversationContent() {
      return {};
    }
  },
  Mutation: {
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

        if (args.reviewed !== null && args.reviewed !== undefined) {
          queryBuilder.where({ reviewed: args.reviewed });
        }

        if (args.orderBy && args.orderByDirection) {
          queryBuilder.orderBy(args.orderBy, args.orderByDirection);
        }
      });
    }
  },
  ConversationContentMutation: {
    async changeReviewed(_, args) {
      const conversation = await WIKI.models.conversationContent.updateConversationContent(
        {
          reviewed: args.reviewed,
          id: args.id
        }
      );

      return conversation;
    }
  }
};
