export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    await $fetch('/api/v1/email/reset-password', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.API_ROUTE_SECRET,
      },
      body: { email, token },
    })
  } catch (error: any) {
    console.error('Error sending password reset email:', error)
    throw new Error('Error sending password reset email:', error)
  }
}
