import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
import { template as waitlistConfirmation } from './waitlist-confirmation'
import { template as waitlistHint1 } from './waitlist-hint-1'
import { template as waitlistHint2 } from './waitlist-hint-2'
import { template as waitlistQuestion } from './waitlist-question'
import { template as waitlistOpening } from './waitlist-opening'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'waitlist-confirmation': waitlistConfirmation,
  'waitlist-hint-1': waitlistHint1,
  'waitlist-hint-2': waitlistHint2,
  'waitlist-question': waitlistQuestion,
  'waitlist-opening': waitlistOpening,
}
