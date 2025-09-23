import { $generateHtmlFromNodes } from '@lexical/html'
import { AutoLinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { Box } from '@mui/material'
import type { EditorState, LexicalEditor } from 'lexical'
import React from 'react'

import muiTheme from '@app/theme'
import { noop } from '@app/util'

import { AutoUrlAndEmailPlugin } from './plugins/AutoUrlAndEmailPlugin'
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin'
import { SetHthmlValuePlugin } from './plugins/SetHthmlValuePlugin'
import { ToobarPlugin } from './plugins/ToolbarPlugin'
import { isEditorEmpty } from './utils'
import './formatting.css'

const theme = {
  rtl: 'rte-rtl',
  ltr: 'rte-ltr',
  text: {
    bold: 'rte-bold',
    italic: 'rte-italic',
    underline: 'rte-underline',
  },
}

export type RichTextEditorProps = {
  onChange?: (value: string) => void
  value?: string
  editable?: boolean
  maxLength?: number
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onChange = noop,
  value,
  maxLength,
  editable = true,
}) => {
  // Catch any errors that occur during Lexical updates and log them
  // or throw them as needed. If you don't throw them, Lexical will
  // try to recover gracefully without losing user data.
  const onError = (error: Error) => {
    console.error(error)
  }

  const onChangeHandler = (editorState: EditorState, editor: LexicalEditor) => {
    editor.update(() => {
      const isEmpty = isEditorEmpty(editor)
      const htmlString = isEmpty ? '' : $generateHtmlFromNodes(editor, null)
      onChange(htmlString)
    })
  }

  const initialConfig = {
    namespace: 'RichTextEditor',
    onError,
    editable,
    theme,
    nodes: [ListNode, ListItemNode, AutoLinkNode],
  }

  const containerStyle = editable
    ? {
        border: `1px solid ${muiTheme.palette.grey[400]}`,
        borderRadius: 2,
      }
    : {}

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Box sx={containerStyle}>
        {editable && <ToobarPlugin />}
        <Box
          sx={{
            paddingX: 2,
            '& > *': {
              outline: 'none',
            },
          }}
        >
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChangeHandler} />
          <HistoryPlugin />
          <ClearEditorPlugin />
          <AutoUrlAndEmailPlugin />
          <SetHthmlValuePlugin value={value} />
          <ListPlugin />
          {maxLength && <MaxLengthPlugin maxLength={maxLength} />}
        </Box>
      </Box>
    </LexicalComposer>
  )
}
