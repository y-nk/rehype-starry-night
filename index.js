import { selectAll } from "hast-util-select"
import { createStarryNight, all } from '@wooorm/starry-night';

export default function rehypeStarryNight(args = {}) {
  let highlighter = null

  const { grammars = all, ...options } = args

  return async function transform(tree) {
    if (!highlighter) {
      highlighter = await createStarryNight(grammars, options)
    }

    selectAll('code', tree)
      .forEach(node => {
        const { className = [] } = node.properties ?? {}

        const lang = className.find(cx => cx?.startsWith('language-')) ?? ''
        const scope = highlighter.flagToScope(lang.replace('language-', ''))

        if (!scope) return

        const [child] = node.children ?? []
        const { children = [] } = highlighter.highlight(child.value, scope) ?? {}

        if (children.length) node.children = children
      })
  }
}
