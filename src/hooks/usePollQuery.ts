import { useState } from 'react'
import { useInterval } from 'react-use'

type PollFnType = () => Promise<unknown> | void
type UntilFnType = () => boolean

const DEFAULT_INTERVAL = 1000
const DEFAULT_MAX_POLLS = 10

export default function usePollQuery(
  pollFn: PollFnType,
  untilFn: UntilFnType,
  options?: {
    interval?: number
    maxPolls?: number
    onTimeout?: () => void
  }
): [() => void, boolean] {
  const maxPolls = options?.maxPolls ?? DEFAULT_MAX_POLLS
  const interval = options?.interval ?? DEFAULT_INTERVAL

  const [pollCounter, setPollCounter] = useState(maxPolls)
  const [running, setRunning] = useState(false)

  useInterval(
    async () => {
      if (pollCounter === 0 || untilFn()) {
        setRunning(false)
        if (pollCounter === 0 && options?.onTimeout) {
          options.onTimeout()
        }
      } else {
        setPollCounter(count => count - 1)
        await pollFn()
      }
    },
    running ? interval : null
  )

  return [
    () => {
      setRunning(true)
    },
    running,
  ]
}
