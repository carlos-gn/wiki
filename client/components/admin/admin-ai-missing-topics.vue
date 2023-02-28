<template lang='pug'>
  v-container(fluid, grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12)
        .admin-header
          img.animated.fadeInUp(src='/_assets/svg/icon-close-window.svg', alt='Missing topics', style='width: 80px;')
          .admin-header-title
            .headline.blue--text.text--darken-2.animated.fadeInLeft Missing Topics
            .subtitle-1.grey--text.animated.fadeInLeft.wait-p2s View missing topics
          v-spacer
          v-btn.animated.fadeInDown.wait-p1s(icon, color='grey', outlined, @click='refresh')
            v-icon.grey--text mdi-refresh
        v-card.mt-3.animated.fadeInUp
          .pa-2.d-flex.align-center(:class='$vuetify.theme.dark ? `grey darken-3-d5` : `grey lighten-3`')
            v-text-field(
              solo
              flat
              v-model='search'
              prepend-inner-icon='mdi-file-search-outline'
              label='Search Conversations...'
              hide-details
              dense
              style='max-width: 400px;'
              )
            v-spacer
            v-select.ml-2(
              solo
              flat
              hide-details
              dense
              label='Score'
              :items='scores'
              v-model='selectedScore'
              style='max-width: 250px;'
            )
          v-divider
          v-data-table(
            :items='filteredPages'
            :headers='headers'
            :search='search'
            :page.sync='pagination'
            :items-per-page='15'
            :loading='loading'
            must-sort,
            sort-by='updatedAt',
            sort-desc,
            hide-default-footer
            @page-count="pageTotal = $event"
          )
            template(slot='item', slot-scope='props')
              //- .is-clickable(:active='props.selected', @click='$router.push(`/pages/` + props.item.id)')
              tr
                td.text-xs-right {{ props.item.conversationId }}
                td.body-2 {{ props.item.question }}
                td {{ props.item.answer }}
                td {{ props.item.score }}
                td {{ props.item.feedback }}
                td {{ props.item.createdAt | moment('calendar') }}
                td
                  v-menu
                    template(v-slot:activator="{ on, attrs }")
                      v-btn(v-bind="attrs", v-on="on", icon, type="text"): v-icon mdi-dots-horizontal
                    v-list
                      v-list-item(:href="'/e/en/new-page'",  :aria-label='`New page`')
                        v-list-item-avatar.mr-0
                          v-icon mdi-text-box-plus-outline
                        v-list-item-content
                          v-list-item-title {{'New page'}}
                      v-list-item( :aria-label='`Not relevant`', @click="showConfirmationPopup(props.item.id)")
                        v-list-item-avatar.mr-0
                          v-icon(color='error') mdi-cancel
                        v-list-item-content
                          v-list-item-title {{'Not relevant'}}

            template(slot='no-data')
              v-alert.ma-3(icon='mdi-alert', :value='true', outlined) No conversations to display.
          .text-center.py-2.animated.fadeInDown(v-if='this.pageTotal > 1')
            v-pagination(v-model='pagination', :length='pageTotal')
      v-row(justify="center")
        v-dialog(v-model="showPopup", persistent, max-width="480" )
          v-card
            v-card-title(class="text-h5") {{'Are you sure that you want to mark this topic as not relevant?'}}
            v-card-text {{'This action cannot be undone'}}
            v-card-actions
              v-spacer
              v-btn(text @click="closeConfirmationPopup") {{'Cancel'}}
              v-btn(text color="primary" @click="confirmMarking") {{'Confirm'}}

</template>

<script>
import _ from 'lodash'
import conversationByAnswerQuery from 'gql/admin/ai-conversation/conversation-by-answer.gql'
import markAsReviewedMutation from 'gql/admin/ai-conversation/conversation-mutation-mark-as-reviewed.gql'

export default {
  data() {
    return {
      selectedConversation: {},
      pagination: 1,
      conversationContent: [],
      pageTotal: 0,
      headers: [
        { text: 'Conversation', value: 'conversationId', width: 125 },
        { text: 'Question', value: 'question', width: 200 },
        { text: 'Answer', value: 'answer', width: 300 },
        { text: 'Score', value: 'score', width: 85 },
        { text: 'Feedback', value: 'Feedback', width: 200 },
        { text: 'Created At', value: 'createdAt', width: 110 },
        { text: 'Actions', value: false, width: 100 },
      ],
      search: '',
      selectedScore: 'all',
      scores: [
        { text: 'All Scores', value: 'all' },
        { text: '4', value: 4 },
        { text: '3', value: 3 },
        { text: '2', value: 2 },
        { text: '1', value: 1 },
        { text: 'Not rated', value: null }
      ],
      loading: false,
      chosenTopicId: null,
    }
  },
  computed: {
    filteredPages () {
      return _.filter(this.conversationContent, conversationContent => {
        if (this.selectedScore !== 'all' && this.selectedScore !== conversationContent.score) {
          return false
        }

        return true
      })
    },
    showPopup() {
      return Boolean(this.chosenTopicId);
    }
  },
  methods: {
    async refresh() {
      await this.$apollo.queries.conversationContent.refetch()
      this.$store.commit('showNotification', {
        message: 'Conversation list has been refreshed.',
        style: 'success',
        icon: 'cached'
      })
    },
    async markTopicAsReviewed(id) {
      return await this.$apollo.mutate({
        mutation: markAsReviewedMutation,
        variables: {
          id,
          reviewed: true
        }
      })
    },
    closeConfirmationPopup() {
      this.chosenTopicId = null;
    },
    showConfirmationPopup(id) {
      this.chosenTopicId = id;
    },
    async confirmMarking() {
      try {
        this.$store.commit(`loadingStart`, 'admin-pages-refresh')

        const topic = await this.markTopicAsReviewed(this.chosenTopicId);
        const topicId = topic.data.conversationContent.changeReviewed.id;

        this.conversationContent = this.conversationContent.filter(content => content.id !== topicId);

        this.$store.commit('showNotification', {
          message: 'Action completed.',
          style: 'success',
          icon: 'check'
        })
      } catch (e) {
        console.error(e.message);
      } finally {
        this.$store.commit(`loadingStop`, 'admin-pages-refresh')
        this.closeConfirmationPopup();
      }
    }
  },
  apollo: {
    conversationContent: {
      query: conversationByAnswerQuery,
      fetchPolicy: 'network-only',
      variables: {
        answer: `I don't know`
      },
      update: (data) => data.conversationContent.listByAnswer,
      watchLoading (isLoading) {
        this.loading = isLoading
        this.$store.commit(`loading${isLoading ? 'Start' : 'Stop'}`, 'admin-pages-refresh')
      }
    }
  }
}
</script>

<style lang='scss'>
.admin-pages-path {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Roboto Mono', monospace;
}
</style>
