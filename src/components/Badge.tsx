import type { ReactNode } from 'react';
import type { BadgeTone } from '../utils/condition';

const TONES: Record<BadgeTone | 'alert', string> = {
  amber: 'bg-[#FBEBC8] text-[#7A4A06] dark:bg-[#3A2E12] dark:text-[#F5CF85]',
  sky: 'bg-[#DFF1F5] text-[#0F5666] dark:bg-[#12313A] dark:text-[#9AE0EE]',
  slate: 'bg-[#E6E9E2] text-[#3F4B45] dark:bg-[#26312B] dark:text-[#C3CFC8]',
  emerald: 'bg-[#D5F3E4] text-[#0A5A3F] dark:bg-[#123626] dark:text-[#86EBC0]',
  teal: 'bg-[#D3F5F0] text-[#0B5E56] dark:bg-[#10353A] dark:text-[#8CEDE0]',
  violet: 'bg-[#E8E4F8] text-[#463A8F] dark:bg-[#2A2650] dark:text-[#C6BEF5]',
  alert: 'bg-[#FCE1CF] text-[#8A3A0E] dark:bg-[#43250F] dark:text-[#F7B488]',
};

interface Props {
  tone: BadgeTone | 'alert';
  children: ReactNode;
}

export function Badge({ tone, children }: Props) {
  return <span className={`pill ${TONES[tone]}`}>{children}</span>;
}
