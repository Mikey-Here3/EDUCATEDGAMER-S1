'use server'

import { sql } from '@/lib/db'
import { sanitizeInput } from '@/lib/utils'
import { RegistrationResult } from '@/types'
import { MAX_TEAMS } from '@/lib/constants'
import { revalidatePath } from 'next/cache'

export async function registerTeam(formData: any): Promise<RegistrationResult> {
  try {
    if (!formData.teamName || !formData.leaderName || !formData.leaderUid || !formData.whatsapp) {
      return { success: false, error: 'Please fill in all required team captain details.' }
    }

    const sanitizedTeamName = sanitizeInput(formData.teamName)
    const sanitizedLeaderName = sanitizeInput(formData.leaderName)
    const sanitizedLeaderUid = sanitizeInput(formData.leaderUid)
    const sanitizedWhatsapp = sanitizeInput(formData.whatsapp)
    const sanitizedDiscord = formData.discord ? sanitizeInput(formData.discord) : null
    const sanitizedLogoUrl = formData.logoUrl ? sanitizeInput(formData.logoUrl) : null

    // Check duplicate team name
    const existing = await sql`
      SELECT id FROM teams WHERE LOWER(team_name) = LOWER(${sanitizedTeamName}) LIMIT 1;
    `
    if (existing.length > 0) {
      return { success: false, error: 'A team with this name is already registered.' }
    }

    // Get current count
    const countRes = await sql`
      SELECT COUNT(*)::int as count FROM teams WHERE status != 'rejected' AND status != 'cancelled';
    `
    const teamNum = (countRes[0]?.count || 0) + 1
    const teamCode = `EG-${teamNum.toString().padStart(3, '0')}`

    // 1. Insert team into Neon
    const insertedTeam = await sql`
      INSERT INTO teams (
        team_code, team_name, leader_name, leader_uid, whatsapp, discord, logo_url, status
      ) VALUES (
        ${teamCode}, ${sanitizedTeamName}, ${sanitizedLeaderName}, ${sanitizedLeaderUid}, ${sanitizedWhatsapp}, ${sanitizedDiscord}, ${sanitizedLogoUrl}, 'pending'
      )
      RETURNING id, team_code;
    `

    const teamId = insertedTeam[0].id

    // 2. Insert Leader as Player #1
    await sql`
      INSERT INTO players (team_id, player_name, free_fire_uid, player_type)
      VALUES (${teamId}, ${sanitizedLeaderName}, ${sanitizedLeaderUid}, 'leader');
    `

    // 3. Insert Core Squad Members
    if (formData.player2Name && formData.player2Uid) {
      await sql`
        INSERT INTO players (team_id, player_name, free_fire_uid, player_type)
        VALUES (${teamId}, ${sanitizeInput(formData.player2Name)}, ${sanitizeInput(formData.player2Uid)}, 'player');
      `
    }
    if (formData.player3Name && formData.player3Uid) {
      await sql`
        INSERT INTO players (team_id, player_name, free_fire_uid, player_type)
        VALUES (${teamId}, ${sanitizeInput(formData.player3Name)}, ${sanitizeInput(formData.player3Uid)}, 'player');
      `
    }
    if (formData.player4Name && formData.player4Uid) {
      await sql`
        INSERT INTO players (team_id, player_name, free_fire_uid, player_type)
        VALUES (${teamId}, ${sanitizeInput(formData.player4Name)}, ${sanitizeInput(formData.player4Uid)}, 'player');
      `
    }

    // 4. Insert Substitutes (Up to 3 substitutes, 7 total players)
    if (formData.substituteName && formData.substituteUid) {
      await sql`
        INSERT INTO players (team_id, player_name, free_fire_uid, player_type)
        VALUES (${teamId}, ${sanitizeInput(formData.substituteName)}, ${sanitizeInput(formData.substituteUid)}, 'substitute');
      `
    }
    if (formData.substitute2Name && formData.substitute2Uid) {
      await sql`
        INSERT INTO players (team_id, player_name, free_fire_uid, player_type)
        VALUES (${teamId}, ${sanitizeInput(formData.substitute2Name)}, ${sanitizeInput(formData.substitute2Uid)}, 'substitute');
      `
    }
    if (formData.substitute3Name && formData.substitute3Uid) {
      await sql`
        INSERT INTO players (team_id, player_name, free_fire_uid, player_type)
        VALUES (${teamId}, ${sanitizeInput(formData.substitute3Name)}, ${sanitizeInput(formData.substitute3Uid)}, 'substitute');
      `
    }

    revalidatePath('/')
    revalidatePath('/teams')
    revalidatePath('/admin/teams')

    return {
      success: true,
      team_id: teamId,
      team_code: teamCode,
      team_name: sanitizedTeamName
    }
  } catch (error: any) {
    console.error('Neon registration error:', error)
    return { success: false, error: error.message || 'Failed to submit registration to Neon database.' }
  }
}
