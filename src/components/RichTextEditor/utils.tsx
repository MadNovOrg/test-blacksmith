import { $getRoot, LexicalEditor } from 'lexical'

export const isEditorEmpty = (editor: LexicalEditor) => {
  const rootHasOneEmptyChild =
    $getRoot().getFirstChild()?.isEmpty() && $getRoot().getChildrenSize() === 1
  const editorIsEmpty =
    editor.getEditorState().isEmpty() || rootHasOneEmptyChild

  return editorIsEmpty
}
