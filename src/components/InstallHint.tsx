import { useState } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'
import { useI18n } from '../i18n/context'
import { isIos, isStandalone } from '../lib/platform'
import { CloseIcon, ShareIcon } from './Icons'

const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

/**
 * iOS Safari has no install prompt, so explain the "Add to Home Screen" step.
 * Shown only on iPhone/iPad in the browser, and only until dismissed.
 */
export function InstallHint() {
  const { t } = useI18n()
  const [dismissed, setDismissed] = usePersistentState('installHintDismissed', false, isBoolean)
  const [eligible] = useState(() => isIos() && !isStandalone())

  if (!eligible || dismissed) return null

  return (
    <aside className="install-hint" aria-label={t.installTitle}>
      <img className="install-hint__icon" src="./apple-touch-icon-180x180.png" alt="" width={44} height={44} />
      <div className="install-hint__text">
        <p className="install-hint__title">{t.installTitle}</p>
        <p>
          {t.installBody(
            <span className="install-hint__share">
              <ShareIcon width={15} height={15} />
              <span className="sr-only">Share</span>
            </span>,
          )}
        </p>
      </div>
      <button type="button" className="install-hint__close" onClick={() => setDismissed(true)} aria-label={t.dismiss}>
        <CloseIcon width={18} height={18} />
      </button>
    </aside>
  )
}
