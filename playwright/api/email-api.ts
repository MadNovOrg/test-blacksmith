import fetch from 'node-fetch'

import { Email } from '../data/types'
import { delay } from '../util'

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
  const response = await fetch(
    `${baseUrl}/domains/${domain}/inboxes/${inbox}/messages/${id}`,
    { ...requestOptions, method: 'DELETE' }
  )
  if (!response.ok) {
    console.error(`[API] could not delete email: ${await response.text()}`)
  }
}

const getEmail = async (email: string, id: string): Promise<Email> => {
  const [inbox, domain] = email.split('@')
  const response = await fetch(
    `${baseUrl}/domains/${domain}/inboxes/${inbox}/messages/${id}`,
    requestOptions
  )
  if (response.ok) {
    const body = await response.json()
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
    throw console.error(
      `[API] error on reading email with ID ${id}: ${await response.text()}`
    )
  }
}

export const getLatestEmail = async (email: string): Promise<Email> => {
  const [inbox, domain] = email.split('@')
  const url = `${baseUrl}/domains/${domain}/inboxes/${inbox}?limit=1`
  let triesLeft = 10
  do {
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const body = await response.json()
      if (body.msgs.length > 0 && body.msgs[0].seconds_ago < 20) {
        const mesId = body.msgs[0].id
        const result = await getEmail(email, mesId)
        await deleteEmail(email, mesId)
        return result
      }
      await delay(1000)
    } else {
      console.error(`[API] could not read emails: ${await response.text()}`)
    }
    triesLeft--
  } while (triesLeft)
  throw console.error(
    `[API] inbox for ${email} is empty or doesn't have any recent emails`
  )
}
