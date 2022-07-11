import type { App } from 'vue'
import IconSvg from './IconSvg.vue'
export default {
    install: function (app: App) {
        app.component('IconSvg', IconSvg)
    }
}