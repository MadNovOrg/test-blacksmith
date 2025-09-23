// The implementation of this plugin is based on the one in the Lexical playground app:
// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/AutoLinkPlugin/index.tsx
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'
import React from 'react'

const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%_+.~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

const createLinkMatcherWithRegExp = (
  regExp: RegExp,
  urlTransformer: (text: string) => string = text => text,
) => {
  return (text: string) => {
    const match = regExp.exec(text)
    if (match === null) return null
    return {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: urlTransformer(text),
    }
  }
}

const MATCHERS = [
  createLinkMatcherWithRegExp(URL_REGEX, text => {
    return text.startsWith('http') ? text : `https://${text}`
  }),
  createLinkMatcherWithRegExp(EMAIL_REGEX, text => {
    return `mailto:${text}`
  }),
]

export const AutoUrlAndEmailPlugin: React.FC = () => (
  <AutoLinkPlugin matchers={MATCHERS} />
)
