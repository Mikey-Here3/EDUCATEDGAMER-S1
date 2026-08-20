'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlowCard } from '@/components/shared/glow-card'

interface PlayerInputProps {
  title: string
  nameField: string
  uidField: string
  nameValue: string
  uidValue: string
  nameError?: string
  uidError?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  description?: string
}

export function PlayerInput({
  title,
  nameField,
  uidField,
  nameValue,
  uidValue,
  nameError,
  uidError,
  onChange,
  required = false,
  description,
}: PlayerInputProps) {
  return (
    <GlowCard>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-[#DC2626]">{title}</h2>
        {description && <p className="text-sm text-gray-400 mt-1 sm:mt-0">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={nameField}>Player Name {required && '*'}</Label>
          <Input
            id={nameField}
            name={nameField}
            value={nameValue}
            onChange={onChange}
            placeholder="In-game Name"
            className="bg-[#050507] border-gray-800"
          />
          {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>
        <div>
          <Label htmlFor={uidField}>Free Fire UID {required && '*'}</Label>
          <Input
            id={uidField}
            name={uidField}
            value={uidValue}
            onChange={onChange}
            placeholder="e.g. 123456789"
            className="bg-[#050507] border-gray-800"
          />
          {uidError && <p className="text-red-500 text-sm mt-1">{uidError}</p>}
        </div>
      </div>
    </GlowCard>
  )
}
