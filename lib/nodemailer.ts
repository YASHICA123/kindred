// Stub: Email functionality disabled
export async function sendEmail(to: string, subject: string, html: string) {
  console.warn('Email functionality disabled')
  return { success: false, message: 'Email not configured' }
}
