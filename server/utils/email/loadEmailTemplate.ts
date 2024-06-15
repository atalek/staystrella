import { verifyEmail } from '../emails/verify-email'
import { resetPassword } from '../emails/reset-password'

export const loadEmailTemplates = (
  templateName: string,
  link: string,
  baseUrl: string,
) => {
  let template = ''

  switch (templateName) {
    case 'verify-email':
      template = verifyEmail
      break
    case 'reset-password':
      template = resetPassword
      break
    default:
      throw new Error('Unknown template name')
  }

  template = template.replace(/{{link}}/g, link)
  template = template.replace(/{{baseUrl}}/g, baseUrl)

  return template
}
