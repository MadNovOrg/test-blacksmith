import { $generateNodesFromDOM } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot, $insertNodes, CLEAR_EDITOR_COMMAND } from 'lexical'
import React, { useEffect } from 'react'

type Props = {
  value?: string
}

export const SetHthmlValuePlugin: React.FC<Props> = ({ value }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // An empty string is a falsy value, but we want to set it anyway
    if (value || value === '') {
      // Clear the existing text inside the editor
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)

      editor.update(() => {
        // In the browser you can use the native DOMParser API to parse the HTML string.
        const parser = new DOMParser()
        const dom = parser.parseFromString(value, 'text/html')

        // Once you have the DOM instance it's easy to generate LexicalNodes.
        const nodes = $generateNodesFromDOM(editor, dom)

        // Select the root
        $getRoot().select()

        // Insert them at a selection.
        $insertNodes(nodes)
      })
    }
  }, [editor, value])

  return null
}
