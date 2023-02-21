<template lang='pug'>
  v-container(fluid, grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12)
        .admin-header
          img.animated.fadeInUp(src='/_assets/svg/icon-web-design.svg', alt='Feedback', style='width: 80px;')
          .admin-header-title
            .headline.blue--text.text--darken-2.animated.fadeInLeft Feedbacks
            .subtitle-1.grey--text.animated.fadeInLeft.wait-p2s View feedbacks
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
              label='Search Feedbacks...'
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
            template(slot='no-data')
              v-alert.ma-3(icon='mdi-alert', :value='true', outlined) No feedbacks to display.
          .text-center.py-2.animated.fadeInDown(v-if='this.pageTotal > 1')
            v-pagination(v-model='pagination', :length='pageTotal')
</template>

<script>
import _ from 'lodash'
import conversationContentQuery from 'gql/admin/ai-conversation/conversation-content-query-list.gql'

export default {
  data() {
    return {
      selectedFeedback: {},
      pagination: 1,
      conversationContent: [],
      pageTotal: 0,
      headers: [
        { text: 'Conversation ID', value: 'conversationId' },
        { text: 'Question', value: 'question' },
        { text: 'Answer', value: 'answer' },
        { text: 'Score', value: 'score' },
        { text: 'Feedback', value: 'Feedback' },
        { text: 'Created At', value: 'createdAt' }
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
      loading: false
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
    }
  },
  methods: {
    async refresh() {
      await this.$apollo.queries.pages.refetch()
      this.$store.commit('showNotification', {
        message: 'Feedback list has been refreshed.',
        style: 'success',
        icon: 'cached'
      })
    }
  },
  apollo: {
    conversationContent: {
      query: conversationContentQuery,
      fetchPolicy: 'network-only',
      update: (data) => data.conversationContent.list,
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
