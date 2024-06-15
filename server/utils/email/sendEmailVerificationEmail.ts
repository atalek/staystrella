export async function sendEmailVerificationEmail(email: string, token: string) {
  try {
    await $fetch('/api/v1/email/request-verification', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.API_ROUTE_SECRET,
      },
      body: { email, token },
    })
  } catch (error: any) {
    console.error('Error sending email verification email:', error)
    throw new Error('Error sending email verification email:', error)
  }
}
