import axios from 'axios'

import { Email } from '@qa/data/types'
import { delay } from '@qa/util'

type EmailPart = {
  headers: {
    'content-type': string
  }
  body: string
}

const baseUrl = 'https://mailinator.com/api/v2'

const requestOptions = {
  headers: { Authorization: 'e56497da871f4d7d9587a61f3a26718b' },
}

const deleteEmail = async (email: string, id: string) => {
  const [inbox, domain] = email.split('@')
  const response = await axios.delete(
    `${baseUrl}/domains/${domain}/inboxes/${inbox}/messages/${id}`,
    requestOptions
  )
  if (response.status !== 200) {
    console.error(`[API] could not delete email: ${response.statusText}`)
  }
}

const getEmail = async (
  inbox: string,
  domain: string,
  id: string
): Promise<Email> => {
  const url = `${baseUrl}/domains/${domain}/inboxes/${inbox}/messages/${id}`
  // Try to overcome any Mailinator API issues (e.g: 500s)
  let triesLeft = 3
  do {
    const response = await axios.get(url, requestOptions)
    if (response.status === 200) {
      const body = response.data
      const htmlPart = (body.parts as Array<EmailPart>).find(part =>
        part.headers['content-type'].startsWith('text/html')
      )
      if (!htmlPart) {
        throw Error('Could not find html part of the email')
      }
      return {
        from: body.fromfull,
        subject: body.subject,
        html: htmlPart.body,
      }
    } else {
      console.error(
        `[API] error on reading email with ID ${id}: ${response.statusText}`
      )
    }
    triesLeft--
  } while (triesLeft > 0)
  throw new Error(`[API] there was an error reading ${inbox}@${domain}`)
}

export const getLatestEmail = async (
  email: string,
  subject?: string
): Promise<Email> => {
  const [inbox, domain] = email.split('@')
  const url = `${baseUrl}/domains/${domain}/inboxes/${inbox}?limit=1`
  let triesLeft = 10
  do {
    const response = await axios.get(url, requestOptions)
    if (response.status === 200) {
      const body = response.data
      const emailFound = body.msgs.length > 0 && body.msgs[0].seconds_ago < 30
      if (emailFound && subject && body.msgs[0].subject !== subject) {
        // If subject is specified but doesn't match, skip this email
        continue
      }
      if (emailFound) {
        const mesId = body.msgs[0].id
        const result = await getEmail(inbox, domain, mesId)
        await deleteEmail(email, mesId)
        return result
      }
      await delay(1000)
    } else {
      console.error(`[API] could not read emails for: '${response.statusText}'`)
    }
    triesLeft--
  } while (triesLeft > 0)
  const errorMessage = subject ? `with the subject "${subject}"` : ''
  throw new Error(
    `[API] inbox for ${email} is empty or doesn't have any recent emails ${errorMessage}`
  )
}
