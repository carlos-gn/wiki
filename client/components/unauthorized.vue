<template lang='pug'>
  v-app
    .unauthorized
      .unauthorized-content
        img.animated.fadeIn(src='/_assets/svg/icon-delete-shield.svg', alt='Unauthorized')
        .headline {{$t('unauthorized.title')}}
        .subtitle-1.mt-3 {{$t('unauthorized.action.' + action)}}
        div.d-flex(style='column-gap: 12px;')
          v-btn.mt-5(color='primary lighten-4', href='javascript:window.history.go(-1);', outlined)
            v-icon(left) mdi-arrow-left
            span {{$t('unauthorized.goback')}}
          v-btn.mt-5(color='primary', href='/login')
            v-icon(left) mdi-login
            span {{$t('unauthorized.login')}}
</template>

<script>

export default {
  props: {
    action: {
      type: String,
      default: 'view'
    }
  },
  data() {
    return { }
  }
}
</script>

<style lang='scss'>

</style>
