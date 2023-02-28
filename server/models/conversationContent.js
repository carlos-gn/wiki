const Model = require("objection").Model;
const omit = require("lodash").omit;

/* global WIKI */

/**
 * Conversation content model
 */
module.exports = class ConversationContent extends Model {
  static get tableName() {
    return "deel.conversation_content";
  }
  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["id"],

      properties: {
        id: { type: "integer" },
        conversation_id: { type: "integer" },
        question: { type: "string" },
        answer: { type: "string" },
        score: { type: "integer" },
        feedback: { type: "string" },
        reviewed: { type: "boolean" },
        created_at: { type: "string" }
      }
    };
  }

  static get relationMappings() {}

  static async getConversationContent(opts) {
    return WIKI.models.conversationContent.query();
  }

  static async getConversationContentById(id) {
    return WIKI.models.conversationContent.query().findById(id);
  }

  static async updateConversationContent(opts) {
    const ogContent = await this.getConversationContentById(opts.id);
    if (!ogContent) {
      throw new Error("Invalid Conversation Id");
    }

    await WIKI.models.conversationContent
      .query()
      .patch({
        ...omit(opts, ["id"])
      })
      .where("id", opts.id);

    const conversationContent = await this.getConversationContentById(opts.id);

    return conversationContent;
  }
};
