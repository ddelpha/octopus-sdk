<template>
  <div class="snack-bar-wrap" :style="style.wrap">
    <template v-for="(msg,i) in msgs">
      <div :key="i"
           class="snack-bar"
           :style="style.bar(msg.color)"
           @click="pop(i)"
           v-html="msg.msg.message||msg.msg">
      </div>
      <br :key="i+'1'">
    </template>
  </div>
</template>

<script>

const getStyle = (baseSize, position) => {
  const c = f => `calc(${f} * ${baseSize})`
  const { pos, textAlign } = position
  return {
    wrap: {
      position: 'fixed',
      left: 0,
      [pos]: c(0.05),
      zIndex: 9999,
      width: '100%',
      padding: `0 ${c(0.2)}`,
      pointerEvents: 'none',
      textAlign,
    },
    bar: bg => ({
      display: 'inline-block',
      width: 'auto',
      minWidth: baseSize,
      maxWidth: `calc(100vw - ${c(0.4)})`,
      padding: `${c(0.15)} ${c(0.2)}`,
      margin: `0 0 ${c(0.05)}`,
      borderRadius: c(0.02),
      lineHeight: c(0.2),
      color: '#fff',
      background: bg,
      boxShadow: `0 ${c(0.01)} ${c(0.025)} rgba(0,0,0, .15)`,
      cursor: 'pointer',
      textAlign: 'center',
      pointerEvents: 'all',
      userSelect: 'none',
    }),
  }
}
export default {
  name: 'Snackbar',
  props: {
    colors: {
      default() {
        return {
          open: '#333',
          info: '#3DBD7D',
          error: '#FA7377',
          warn: '#FF6600',
        }
      },
      type: Object,
    },
    position: {
      default: 'top-center',
      type: String,
    },
  },
  data() {
    return {
      msgs: [],
			holdTime:3000,
			baseSize: '5rem',
    }
  },
  computed: {
    $_position() {
      const [p, textAlign] = this.position.toString().split('-')
      return {
        pos: ['top', 'bottom'].includes(p) ? p : 'top',
        textAlign: ['left', 'center', 'right'].includes(textAlign) ? textAlign : 'center',
      }
    },
    style() {
      return getStyle(this.baseSize, this.$_position)
    },
  },
  methods: {
    info(msg) {
      const color = this.colors.info
      this.open({ color, msg }, false)
      return true
    },
    error(msg) {
      const color = this.colors.error
      this.open({ color, msg }, false)
      return false
    },
    warn(msg) {
      const color = this.colors.warn
      this.open({ color, msg }, false)
      return true
    },
    open(message, isOpen = true) {
      let msg
      let color
      if (!isOpen) {
        ({ color } = message)
        msg = message.msg
      } else {
        color = this.colors.open
        msg = message
      }
      const msgObj = {
        color,
        msg,
        timer: setTimeout(this.pop, this.holdTime),
      }
      
      this.msgs.push(msgObj)
      
      return true
    },
    pop(i = 0) {
      if (this.msgs[i]) clearTimeout(this.msgs[i].timer)
      this.msgs.splice(i, 1)
    },
  },
}
</script>