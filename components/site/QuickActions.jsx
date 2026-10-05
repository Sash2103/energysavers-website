import Icon from '@/components/shared/Icon';
import QuickBar from '@/components/behaviour/QuickBar';

// Floating Call and WhatsApp buttons: shown on phones once the page head is out of view, hidden at the contact section.
export default function QuickActions() {
  return (
    <div className="quick-actions" id="quick-actions">
      <a className="quick-actions__btn" href="tel:+971525360124" aria-label="Call +971 52 536 0124"><Icon name="phone" /><span>Call</span></a>
      <a className="quick-actions__btn quick-actions__btn--wa" href="https://wa.me/971525360124" aria-label="WhatsApp +971 52 536 0124"><Icon name="whatsapp" /><span>WhatsApp</span></a>
      <QuickBar />
    </div>
  );
}
