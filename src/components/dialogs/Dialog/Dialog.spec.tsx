import { Button } from '@mui/material'

import { render, fireEvent, waitForCalls } from '@test/index'

import { Dialog } from './Dialog'

describe(Dialog.name, () => {
  it('should not render children when open is false', async () => {
    // Act
    const { queryByTestId } = render(
      <Dialog open={false} onClose={vi.fn()}>
        <p data-testid="dialog-children">test</p>
      </Dialog>,
    )

    // Assert
    expect(queryByTestId('dialog-children')).not.toBeInTheDocument()
  })

  it('should render children when open is true', async () => {
    // Act
    const { queryByTestId } = render(
      <Dialog open={true} onClose={vi.fn()}>
        <p data-testid="dialog-children">test</p>
      </Dialog>,
    )

    // Assert
    expect(queryByTestId('dialog-children')).toBeInTheDocument()
  })

  it('should render title when provided', async () => {
    // Act
    const { queryByTestId } = render(
      <Dialog
        open={true}
        title={<p data-testid="dialog-title">my title</p>}
        onClose={vi.fn()}
      >
        <p data-testid="dialog-children">test</p>
      </Dialog>,
    )

    // Assert
    expect(queryByTestId('dialog-title')).toBeInTheDocument()
  })

  it('should render close button by default', async () => {
    // Act
    const { queryByTestId } = render(
      <Dialog open={true} onClose={vi.fn()}></Dialog>,
    )

    // Assert
    expect(queryByTestId('dialog-close')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    // Arrange
    const onClose = vi.fn()

    // Act
    const { getByTestId } = render(
      <Dialog open={true} onClose={onClose}></Dialog>,
    )

    const closeBtn = getByTestId('dialog-close')
    fireEvent.click(closeBtn)

    // Assert
    await waitForCalls(onClose)
  })

  it('should not render close button when showClose is false', async () => {
    // Act
    const { queryByTestId } = render(
      <Dialog open={true} showClose={false} onClose={vi.fn()}></Dialog>,
    )

    // Assert
    expect(queryByTestId('dialog-close')).not.toBeInTheDocument()
  })

  describe('Slots', () => {
    it('should render Title slot', () => {
      // Arrange
      const TitleSlot = () => <>TitleSlot</>
      // Act
      const { queryByText } = render(
        <Dialog
          open={true}
          showClose={false}
          onClose={vi.fn()}
          slots={{
            Title: () => <TitleSlot />,
          }}
        ></Dialog>,
      )

      // Assert
      expect(queryByText('TitleSlot')).toBeInTheDocument()
    })

    it('should render Subtitle slot', () => {
      // Arrange
      const SubtitleSlot = () => <>SubtitleSlot</>
      // Act
      const { queryByText } = render(
        <Dialog
          open={true}
          showClose={false}
          onClose={vi.fn()}
          slots={{
            Subtitle: () => <SubtitleSlot />,
          }}
        ></Dialog>,
      )

      // Assert
      expect(queryByText('SubtitleSlot')).toBeInTheDocument()
    })

    it('should render Content slot', () => {
      // Arrange
      const ContentSlot = () => <>ContentSlot</>
      // Act
      const { queryByText } = render(
        <Dialog
          open={true}
          showClose={false}
          onClose={vi.fn()}
          slots={{
            Content: () => <ContentSlot />,
          }}
        ></Dialog>,
      )

      // Assert
      expect(queryByText('ContentSlot')).toBeInTheDocument()
    })

    it('should render Actions slot', () => {
      // Arrange
      const ActionsSlot = () => (
        <>
          <Button>Close</Button>
          <Button>Submit</Button>
        </>
      )
      // Act
      const { queryAllByRole, queryByText } = render(
        <Dialog
          open={true}
          showClose={false}
          onClose={vi.fn()}
          slots={{
            Actions: () => <ActionsSlot />,
          }}
        ></Dialog>,
      )

      // Assert
      expect(queryAllByRole('button').length).toEqual(2)
      expect(queryByText('Close')).toBeInTheDocument()
      expect(queryByText('Submit')).toBeInTheDocument()
    })
  })
})
