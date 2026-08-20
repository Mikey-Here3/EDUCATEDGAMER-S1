export type TeamStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  date: string | null;
  time: string | null;
  max_teams: number;
  team_size: number;
  game_mode: string | null;
  map: string | null;
  prize_pool: string | null;
  registration_open: boolean;
  registration_deadline: string | null;
  counting_policy: 'all' | 'approved';
  show_player_details: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  tournament_id: string;
  team_code: string;
  team_name: string;
  leader_name: string;
  leader_uid: string;
  whatsapp: string;
  discord: string | null;
  logo_url: string | null;
  status: TeamStatus;
  created_at: string;
  updated_at: string;
  players?: Player[];
  team_players?: Player[];
}

export interface Player {
  id: string;
  team_id: string;
  tournament_id?: string;
  player_name: string;
  free_fire_uid: string;
  player_type: 'leader' | 'player' | 'substitute';
  created_at?: string;
}

export interface TournamentSetting {
  id: string;
  tournament_id: string;
  key: string;
  value: string | null;
}

export interface AdminLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface RegistrationFormData {
  teamName: string;
  leaderName: string;
  leaderUid: string;
  whatsapp: string;
  discord: string;
  logoUrl: string;
  player2Name: string;
  player2Uid: string;
  player3Name: string;
  player3Uid: string;
  player4Name: string;
  player4Uid: string;
  substituteName: string;
  substituteUid: string;
}

export interface RegistrationResult {
  success: boolean;
  team_id?: string;
  team_code?: string;
  team_name?: string;
  error?: string;
}

export interface TournamentSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  youtube_url: string;
  tiktok_url: string;
  facebook_url: string;
  discord_url: string;
  custom_room_info: string;
  rules: string;
  [key: string]: string;
}

export interface RuleSection {
  title: string;
  content: string;
}
