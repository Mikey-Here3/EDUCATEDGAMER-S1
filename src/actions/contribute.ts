'use server'

import { sql } from '@/lib/db'
import { sanitizeInput, ensureAbsoluteUrl } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function submitContribution(formData: {
  contributorName: string
  isAnonymous: boolean
  amount: number
  paymentMethod: string
  proofUrl?: string | null
  message?: string | null
}) {
  try {
    if (!formData.amount || formData.amount < 10) {
      return { success: false, error: 'Please enter a valid contribution amount (minimum 10 PKR).' }
    }

    const isAnon = Boolean(formData.isAnonymous)
    const rawName = isAnon ? 'Anonymous Supporter' : (formData.contributorName || 'Anonymous Supporter')
    const sanitizedName = sanitizeInput(rawName)
    const sanitizedMsg = formData.message ? sanitizeInput(formData.message) : null
    const sanitizedProof = formData.proofUrl ? ensureAbsoluteUrl(formData.proofUrl) : null
    const method = formData.paymentMethod || 'JazzCash'

    const res = await sql`
      INSERT INTO contributions (
        contributor_name, is_anonymous, amount, payment_method, proof_url, message, status
      ) VALUES (
        ${sanitizedName}, ${isAnon}, ${formData.amount}, ${method}, ${sanitizedProof}, ${sanitizedMsg}, 'approved'
      )
      RETURNING id;
    `

    revalidatePath('/contribute')
    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true, id: res[0]?.id }
  } catch (err: any) {
    console.error('Neon contribution error:', err)
    return { success: false, error: err.message || 'Failed to submit contribution record.' }
  }
}
