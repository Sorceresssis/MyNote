// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './global.css'
import './enhance.css'
import './reader-adapt.css'
import RecipeCalculator from './components/RecipeCalculator.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp(ctx) {
    ctx.app.component('RecipeCalculator', RecipeCalculator)
  }
} satisfies Theme
