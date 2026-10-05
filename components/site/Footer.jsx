import Brand from './Brand';
import Icon from '@/components/shared/Icon';

const LINKS = [
  ['about', 'About'],
  ['products', 'Products'],
  ['solutions', 'Solutions'],
  ['services', 'Services'],
  ['sectors', 'Sectors'],
  ['case-studies', 'Case studies'],
  ['blog', 'Blog'],
  ['contact-us', 'Contact'],
];

export default function Footer({ home = false }) {
  return (
    <footer className="site-footer on-ink">
      <div className="wrap site-footer__grid">
        <Brand home={home} footer />
        <nav className="site-footer__nav" aria-label="Footer">
          <ul>
            {LINKS.map(([slug, label]) => <li key={slug}><a href={`/${slug}/`}>{label}</a></li>)}
          </ul>
        </nav>
        <a className="site-footer__social" href="https://www.linkedin.com/company/energy-savers-technical-services-llc"><Icon name="linkedin" />LinkedIn</a>
        <p className="site-footer__certs">ISO 9001:2015 · Dubai Energy Auditors Accreditation Scheme</p>
        <p className="site-footer__legal">© 2026 Energy Savers Technical Services LLC. All rights reserved.</p>
      </div>
    </footer>
  );
}
