import { z } from 'zod';

const playerNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(25, 'Name must be at most 25 characters')
  .regex(/^[a-zA-Z0-9\s._-]+$/, 'Name contains invalid characters');

const freeFireUidSchema = z
  .string()
  .min(6, 'UID must be at least 6 digits')
  .max(12, 'UID must be at most 12 digits')
  .regex(/^\d+$/, 'UID must contain only numbers');

const whatsAppSchema = z
  .string()
  .min(7, 'Phone number is too short')
  .max(15, 'Phone number is too long')
  .regex(/^\+?\d{7,15}$/, 'Invalid phone number format');

export const registrationSchema = z.object({
  teamName: z
    .string()
    .min(3, 'Team name must be at least 3 characters')
    .max(30, 'Team name must be at most 30 characters')
    .regex(/^[a-zA-Z0-9\s._-]+$/, 'Team name contains invalid characters'),
  leaderName: playerNameSchema,
  leaderUid: freeFireUidSchema,
  whatsapp: whatsAppSchema,
  discord: z.string().max(50).optional().or(z.literal('')),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  player2Name: playerNameSchema,
  player2Uid: freeFireUidSchema,
  player3Name: playerNameSchema,
  player3Uid: freeFireUidSchema,
  player4Name: playerNameSchema,
  player4Uid: freeFireUidSchema,
  substituteName: z.string().max(25).optional().or(z.literal('')),
  substituteUid: z.string().max(12).optional().or(z.literal('')),
}).refine((data) => {
  // If substitute name is provided, UID must also be provided
  if (data.substituteName && data.substituteName.trim() !== '' && (!data.substituteUid || data.substituteUid.trim() === '')) {
    return false;
  }
  if (data.substituteUid && data.substituteUid.trim() !== '' && (!data.substituteName || data.substituteName.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Both substitute name and UID must be provided together',
  path: ['substituteUid'],
}).refine((data) => {
  // Validate substitute UID format if provided
  if (data.substituteUid && data.substituteUid.trim() !== '') {
    return /^\d{6,12}$/.test(data.substituteUid);
  }
  return true;
}, {
  message: 'Substitute UID must be 6-12 digits',
  path: ['substituteUid'],
}).refine((data) => {
  // All UIDs must be unique
  const uids = [data.leaderUid, data.player2Uid, data.player3Uid, data.player4Uid];
  if (data.substituteUid && data.substituteUid.trim() !== '') {
    uids.push(data.substituteUid);
  }
  const uniqueUids = new Set(uids);
  return uniqueUids.size === uids.length;
}, {
  message: 'All player UIDs must be unique',
  path: ['leaderUid'],
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
