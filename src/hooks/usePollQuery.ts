import { useState } from 'react'
import { useInterval } from 'react-use'

type PollFnType = () => Promise<unknown>
type UntilFnType = () => boolean

export default function usePollQuery(
  pollFn: PollFnType,
  untilFn: UntilFnType,
  options: {
    interval: number
    maxPolls: number
  } = { interval: 1000, maxPolls: 10 }
): [() => void, boolean] {
  const [pollCounter, setPollCounter] = useState(options.maxPolls)
  const [running, setRunning] = useState(false)

  useInterval(
    async () => {
      if (pollCounter === 0 || untilFn()) {
        setRunning(false)
      } else {
        setPollCounter(count => count - 1)
        await pollFn()
      }
    },
    running ? options.interval : null
  )

  return [
    () => {
      setRunning(true)
    },
    running,
  ]
}
