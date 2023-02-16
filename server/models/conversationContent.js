const Model = require('objection').Model

/* global WIKI */

/**
 * Conversation content model
 */
module.exports = class ConversationContent extends Model {
  static get tableName() { return 'deel.conversation_content' }
  static get idColumn() { return 'id' }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['id'],

      properties: {
        id: {type: 'integer'},
        conversation_id: {type: 'integer'},
        question: {type: 'string'},
        answer: {type: 'string'},
        score: {type: 'integer'},
        feedback: {type: 'string'},
        created_at: {type: 'string'}
      }
    }
  }

  static get relationMappings() {

  }

  static async getConversationContent(opts) {
    return WIKI.models.conversationContent.query()
  }
}
