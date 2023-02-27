<template>
  <div>
    <status-indicator v-bind="getPublishedConfigs"/>
    <span v-if="showText" :class="`caption ${isPublished ? 'green--text' : 'red--text'}`">
      {{$t(`common:page.${isPublished ? 'published' : isPublished ? 'published' : 'unpublished'}`)}}
    </span>
  </div>
</template>

<script>
import {StatusIndicator} from "vue-status-indicator";

export default {
  components: {
      StatusIndicator
  },
  computed: {
    getPublishedConfigs() {
      const configs = {
        pulse: this.showIndication,
        class: `mr-3 caption`
      }

      return this.isPublished ? {...configs, positive: true} : {
        ...configs,
        negative: true,
      };
    },
  },
  props: ['isPublished', 'showIndication', 'showText'],
  name: "page-status"
}
</script>

<style scoped>

</style>
