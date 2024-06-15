import { Resend } from 'resend'
import { loadEmailTemplate } from '~/server/utils/email/emailTemplates'
import { loadEmailTemplates } from '~/server/utils/email/loadEmailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async event => {
  const body = await readBody<{ email: string; token: string }>(event)
  const headers = getHeader(event, 'Authorization')

  const apiRouteSecret = headers?.split(' ')[1]

  if (apiRouteSecret !== process.env.API_ROUTE_SECRET) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { email, token } = body

  const resetLink = `${process.env.BASE_URL}/new-password?token=${token}`

  try {
    const htmlContent = loadEmailTemplates(
      'reset-password',
      resetLink,
      process.env.BASE_URL as string,
    )

    const data = await resend.emails.send({
      from: 'Staystrella <staystrella@atalek.com>',
      to: [email],
      subject: 'Password reset',
      html: htmlContent,
    })

    return data
  } catch (error) {
    return { error }
  }
})
