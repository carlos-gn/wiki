/* global WIKI */

module.exports = {
  Query: {
    async conversationContent() { return {} }
  },
  ConversationContentQuery: {
    async list(obj, args, context, info) {
      return WIKI.models.conversationContent.getConversationContent()
    }
  }
}
