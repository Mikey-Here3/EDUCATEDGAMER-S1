'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeInput } from '@/lib/utils'
import { RegistrationResult } from '@/types'
import { TOURNAMENT_ID, MAX_TEAMS } from '@/lib/constants'

export async function registerTeam(formData: any): Promise<RegistrationResult> {
  try {
    const supabaseAdmin = createAdminClient()

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
    const { data: existingTeam } = await supabaseAdmin
      .from('teams')
      .select('id')
      .eq('tournament_id', TOURNAMENT_ID)
      .ilike('team_name', sanitizedTeamName)
      .maybeSingle()

    if (existingTeam) {
      return { success: false, error: 'A team with this name is already registered.' }
    }

    // Check existing approved team count
    const { count: teamCount } = await supabaseAdmin
      .from('teams')
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', TOURNAMENT_ID)
      .not('status', 'in', '("rejected","cancelled")')

    const teamNum = (teamCount || 0) + 1
    const teamCode = `EG-${teamNum.toString().padStart(3, '0')}`

    // 1. Insert team
    const { data: teamData, error: teamError } = await supabaseAdmin
      .from('teams')
      .insert({
        tournament_id: TOURNAMENT_ID,
        team_name: sanitizedTeamName,
        leader_name: sanitizedLeaderName,
        leader_uid: sanitizedLeaderUid,
        whatsapp: sanitizedWhatsapp,
        discord: sanitizedDiscord,
        logo_url: sanitizedLogoUrl,
        team_code: teamCode,
        status: (teamCount || 0) < MAX_TEAMS ? 'pending' : 'pending' // pending review
      })
      .select('id, team_code')
      .single()

    if (teamError) {
      return { success: false, error: teamError.message || 'Failed to create team.' }
    }

    // 2. Insert Leader as Player #1
    const playersToInsert = [
      {
        team_id: teamData.id,
        tournament_id: TOURNAMENT_ID,
        player_name: sanitizedLeaderName,
        free_fire_uid: sanitizedLeaderUid,
        player_type: 'leader'
      }
    ]

    // 3. Insert Core Squad (Members #2, #3, #4)
    if (formData.player2Name && formData.player2Uid) {
      playersToInsert.push({
        team_id: teamData.id,
        tournament_id: TOURNAMENT_ID,
        player_name: sanitizeInput(formData.player2Name),
        free_fire_uid: sanitizeInput(formData.player2Uid),
        player_type: 'player'
      })
    }
    if (formData.player3Name && formData.player3Uid) {
      playersToInsert.push({
        team_id: teamData.id,
        tournament_id: TOURNAMENT_ID,
        player_name: sanitizeInput(formData.player3Name),
        free_fire_uid: sanitizeInput(formData.player3Uid),
        player_type: 'player'
      })
    }
    if (formData.player4Name && formData.player4Uid) {
      playersToInsert.push({
        team_id: teamData.id,
        tournament_id: TOURNAMENT_ID,
        player_name: sanitizeInput(formData.player4Name),
        free_fire_uid: sanitizeInput(formData.player4Uid),
        player_type: 'player'
      })
    }

    // 4. Insert Substitutes (Up to 3 substitutes, making total up to 7 members)
    if (formData.substituteName && formData.substituteUid) {
      playersToInsert.push({
        team_id: teamData.id,
        tournament_id: TOURNAMENT_ID,
        player_name: sanitizeInput(formData.substituteName),
        free_fire_uid: sanitizeInput(formData.substituteUid),
        player_type: 'substitute'
      })
    }
    if (formData.substitute2Name && formData.substitute2Uid) {
      playersToInsert.push({
        team_id: teamData.id,
        tournament_id: TOURNAMENT_ID,
        player_name: sanitizeInput(formData.substitute2Name),
        free_fire_uid: sanitizeInput(formData.substitute2Uid),
        player_type: 'substitute'
      })
    }
    if (formData.substitute3Name && formData.substitute3Uid) {
      playersToInsert.push({
        team_id: teamData.id,
        tournament_id: TOURNAMENT_ID,
        player_name: sanitizeInput(formData.substitute3Name),
        free_fire_uid: sanitizeInput(formData.substitute3Uid),
        player_type: 'substitute'
      })
    }

    // Insert all squad players
    await supabaseAdmin.from('players').insert(playersToInsert)

    return {
      success: true,
      team_id: teamData.id,
      team_code: teamData.team_code,
      team_name: sanitizedTeamName
    }
  } catch (error: any) {
    console.error('Registration server error:', error)
    return { success: false, error: error.message || 'Internal server error' }
  }
}
