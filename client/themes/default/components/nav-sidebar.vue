<template lang="pug">
  div
    .pa-3.d-flex(v-if='navMode === `MIXED`', :class='$vuetify.theme.dark ? `grey darken-4-d4` : `grey lighten-5`')
      v-btn(
        depressed
        :color='$vuetify.theme.dark ? `grey darken-4-d4` : `grey lighten-5`'
        style='min-width:0;'
        @click='goHome'
        :aria-label='$t(`common:header.home`)'
        :class='$vuetify.theme.dark ? `white--text` : `black--text`'
        )
        v-icon(size='20') mdi-home
      v-btn.ml-3(
        v-if='currentMode === `custom`'
        depressed
        :color='$vuetify.theme.dark ? `grey darken-4-d4` : `grey lighten-5`'
        style='flex: 1 1 100%;'
        @click='switchMode(`browse`)'
        :class='$vuetify.theme.dark ? `white--text` : `black--text`'
        )
        v-icon(left) mdi-file-tree
        .body-2.text-none {{$t('common:sidebar.browse')}}
      v-btn.ml-3(
        v-else-if='currentMode === `browse`'
        depressed
        :color='$vuetify.theme.dark ? `grey darken-4-d4` : `grey lighten-5`'
        style='flex: 1 1 100%;'
        @click='switchMode(`custom`)'
        :class='$vuetify.theme.dark ? `white--text` : `black--text`'
        )
        v-icon(left) mdi-navigation
        .body-2.text-none {{$t('common:sidebar.mainMenu')}}
    v-divider(:class='$vuetify.theme.dark ? `` : `border-color: white`')
    //-> Custom Navigation
    v-list.py-2(v-if='currentMode === `custom`', dense, :class='color', :dark='dark')
      template(v-for='item of items')
        v-list-item(
          v-if='item.k === `link`'
          :href='item.t'
          :target='item.y === `externalblank` ? `_blank` : `_self`'
          :rel='item.y === `externalblank` ? `noopener` : ``'
          class='navigation-list-item'
          )
          v-list-item-avatar(size='24', tile)
            v-icon(v-if='item.c.match(/fa[a-z] fa-/)', size='19' :class='$vuetify.theme.dark ? `white--text` : `black--text`') {{ item.c }}
            v-icon(v-else, :class='$vuetify.theme.dark ? `white--text` : `black--text`') {{ item.c }}
          v-list-item-title(:class='$vuetify.theme.dark ? `white--text` : `black--text`') {{ item.l }}
        v-divider.my-2(v-else-if='item.k === `divider`', :class='$vuetify.theme.dark ? `` : `border-color: white`')
        v-subheader.pl-4(v-else-if='item.k === `header`') {{ item.l }}
    //-> Browse
    v-list.py-2(v-else-if='currentMode === `browse`', dense, :class='color', :dark='dark')
      template(v-if='currentParent.id > 0')
        v-list-item(v-for='(item, idx) of parents', :key='`parent-` + item.id', @click='fetchBrowseItems(item)', style='min-height: 30px;' class='navigation-list-item')
          v-list-item-avatar(size='18', :style='`padding-left: ` + (idx * 8) + `px; width: auto; margin: 0 5px 0 0;`')
            v-icon(small  :class='$vuetify.theme.dark ? `white--text` : `black--text`') mdi-folder-open
          v-list-item-title( :class='$vuetify.theme.dark ? `white--text` : `black--text`' style='text-transform: capitalize') {{ getItemName(item.title) }}
        v-divider.mt-2(:class='$vuetify.theme.dark ? `` : `border-color: white`')
        v-list-item.mt-2(v-if='currentParent.pageId > 0', :href='`/` + currentParent.locale + `/` + currentParent.path', :key='`directorypage-` + currentParent.id', :input-value='path === currentParent.path')
          v-list-item-avatar(size='24')
            v-icon(:class='$vuetify.theme.dark ? `white--text` : `black--text`' ) mdi-text-box
          v-list-item-title(:class='$vuetify.theme.dark ? `white--text` : `black--text`' style='text-transform: capitalize') {{ getItemName(currentParent.title) }}
        v-subheader.pl-4( :class='$vuetify.theme.dark ? `white--text` : `black--text`') {{$t('common:sidebar.currentDirectory')}}
      template(v-for='item of currentItems')
        v-list-item(v-if='item.isFolder', :key='`childfolder-` + item.id', @click='fetchBrowseItems(item)' class='navigation-list-item')
          v-list-item-avatar(size='24')
            v-icon(:class='$vuetify.theme.dark ? `white--text` : `black--text`') mdi-folder
          v-list-item-title(:class='$vuetify.theme.dark ? `white--text` : `black--text`' style='text-transform: capitalize') {{ getItemName(item.title) }}
        v-list-item(v-else, :href='`/` + item.locale + `/` + item.path', :key='`childpage-` + item.id', :input-value='path === item.path' class='navigation-list-item')
          v-list-item-avatar(size='24')
            v-icon( :class='$vuetify.theme.dark ? `white--text` : `black--text`') mdi-text-box
          v-list-item-content
            v-list-item-title(:class='$vuetify.theme.dark ? `white--text` : `black--text`' style='text-transform: capitalize') {{ getItemName(item.title) }}
          v-list-item-action(v-if="hasPermission(['manage:system', 'write:pages', 'publish:pages'])" )
            page-status(:is-published="item.isPublished" :show-indication="false" :show-text="false")
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import { get } from 'vuex-pathify'
import PageStatus from "../../../components/common/page-status.vue";

/* global siteLangs */

export default {
  components: { PageStatus },
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    dark: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      default: () => []
    },
    navMode: {
      type: String,
      default: 'MIXED'
    }
  },
  data() {
    return {
      currentMode: 'custom',
      currentItems: [],
      currentParent: {
        id: 0,
        title: '/ (root)'
      },
      parents: [],
      loadedCache: []
    }
  },
  computed: {
    path: get('page/path'),
    locale: get('page/locale'),
    permissions: get('user/permissions'),
  },
  methods: {
    switchMode (mode) {
      this.currentMode = mode
      window.localStorage.setItem('navPref', mode)
      if (mode === `browse` && this.loadedCache.length < 1) {
        this.loadFromCurrentPath()
      }
    },
    async fetchBrowseItems (item) {
      this.$store.commit(`loadingStart`, 'browse-load')
      if (!item) {
        item = this.currentParent
      }

      if (this.loadedCache.indexOf(item.id) < 0) {
        this.currentItems = []
      }

      if (item.id === 0) {
        this.parents = []
      } else {
        const flushRightIndex = _.findIndex(this.parents, ['id', item.id])
        if (flushRightIndex >= 0) {
          this.parents = _.take(this.parents, flushRightIndex)
        }
        if (this.parents.length < 1) {
          this.parents.push(this.currentParent)
        }
        this.parents.push(item)
      }

      this.currentParent = item

      const resp = await this.$apollo.query({
        query: gql`
          query ($parent: Int, $locale: String!) {
            pages {
              tree(parent: $parent, mode: ALL, locale: $locale) {
                id
                path
                title
                isFolder
                pageId
                parent
                locale
                isPublished
              }
            }
          }
        `,
        fetchPolicy: 'cache-first',
        variables: {
          parent: item.id,
          locale: this.locale
        }
      })
      this.loadedCache = _.union(this.loadedCache, [item.id])
      this.currentItems = _.get(resp, 'data.pages.tree', []);
      this.$store.commit(`loadingStop`, 'browse-load')
    },
    async loadFromCurrentPath() {
      this.$store.commit(`loadingStart`, 'browse-load')
      const resp = await this.$apollo.query({
        query: gql`
          query ($path: String, $locale: String!) {
            pages {
              tree(path: $path, mode: ALL, locale: $locale, includeAncestors: true) {
                id
                path
                title
                isFolder
                pageId
                parent
                locale
                isPublished
              }
            }
          }
        `,
        fetchPolicy: 'cache-first',
        variables: {
          path: this.path,
          locale: this.locale
        }
      })
      const items = _.get(resp, 'data.pages.tree', [])
      const curPage = _.find(items, ['pageId', this.$store.get('page/id')])
      if (!curPage) {
        console.warn('Could not find current page in page tree listing!')
        return
      }

      let curParentId = curPage.parent
      let invertedAncestors = []
      while (curParentId) {
        const curParent = _.find(items, ['id', curParentId])
        if (!curParent) {
          break
        }
        invertedAncestors.push(curParent)
        curParentId = curParent.parent
      }

      this.parents = [this.currentParent, ...invertedAncestors.reverse()]
      this.currentParent = _.last(this.parents)

      this.loadedCache = [curPage.parent]
      this.currentItems = _.filter(items, ['parent', curPage.parent])
      this.$store.commit(`loadingStop`, 'browse-load')
    },
    goHome () {
      window.location.assign(siteLangs.length > 0 ? `/${this.locale}/home` : '/')
    },
    getItemName (itemTitle) {
      const parts = itemTitle.split('/')
      return parts[parts.length - 1]
    },
    hasPermission(prm) {
      if (_.isArray(prm)) {
        return _.some(prm, p => {
          return _.includes(this.permissions, p)
        })
      } else {
        return _.includes(this.permissions, prm)
      }
    }
  },
  mounted () {
    this.currentParent.title = `/ ${this.$t('common:sidebar.root')}`
    if (this.navMode === 'TREE') {
      this.currentMode = 'browse'
    } else if (this.navMode === 'STATIC') {
      this.currentMode = 'custom'
    } else {
      this.currentMode = window.localStorage.getItem('navPref') || 'custom'
    }
    if (this.currentMode === 'browse') {
      this.loadFromCurrentPath()
    }
  }
}
</script>
