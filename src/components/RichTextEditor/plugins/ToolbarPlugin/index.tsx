import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $findMatchingParent,
  mergeRegister,
  $getNearestNodeOfType,
} from '@lexical/utils'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import RedoIcon from '@mui/icons-material/Redo'
import UndoIcon from '@mui/icons-material/Undo'
import { Box, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material'
import { Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $isRootOrShadowRoot,
} from 'lexical'
import React, { useEffect, useState, useCallback } from 'react'

import theme from '@app/theme'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))

export const ToobarPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const [isListType, setIsListType] = useState<'bullet' | 'number' | null>(null)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))

      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, e => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType()

          setIsListType(type === 'bullet' || type === 'number' ? type : null)
        } else {
          setIsListType(null)
        }
      }
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      )
    )
  }, [editor, updateToolbar])

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.palette.grey[400]}`,
        paddingY: 0.5,
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <StyledToggleButtonGroup size="small">
        <IconButton
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <RedoIcon />
        </IconButton>
      </StyledToggleButtonGroup>

      <Divider orientation="vertical" variant="middle" flexItem />

      <StyledToggleButtonGroup size="small">
        <ToggleButton
          value="bold"
          aria-label="bold"
          selected={isBold}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        >
          <FormatBoldIcon />
        </ToggleButton>
        <ToggleButton
          value="italic"
          aria-label="italic"
          selected={isItalic}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        >
          <FormatItalicIcon />
        </ToggleButton>
        <ToggleButton
          value="underline"
          aria-label="underline"
          selected={isUnderline}
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
          }
        >
          <FormatUnderlinedIcon />
        </ToggleButton>
      </StyledToggleButtonGroup>

      <Divider orientation="vertical" variant="middle" flexItem />

      <StyledToggleButtonGroup size="small">
        <ToggleButton
          value="bulletList"
          aria-label="bullet list"
          selected={isListType === 'bullet'}
          onClick={() => {
            if (isListType !== 'bullet') {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            }
          }}
        >
          <FormatListBulletedIcon />
        </ToggleButton>

        <ToggleButton
          value="numberList"
          aria-label="number list"
          selected={isListType === 'number'}
          onClick={() => {
            if (isListType !== 'number') {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            }
          }}
        >
          <FormatListNumberedIcon />
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  )
}
