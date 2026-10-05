import Brand from './Brand';
import Icon from '@/components/shared/Icon';
import HeaderMenus from '@/components/behaviour/HeaderMenus';
import LogoIntro from '@/components/behaviour/LogoIntro';

// Top-level pages, in menu order. Products is the mega menu, between About and Solutions.
export const NAV = [
  ['about', 'About'],
  ['solutions', 'Solutions'],
  ['services', 'Services'],
  ['sectors', 'Sectors'],
  ['case-studies', 'Case studies'],
  ['blog', 'Blog'],
  ['contact-us', 'Contact'],
];

// The Products mega menu (and the mobile menu's Products group): line page, then its products
const PRODUCT_MENU = [
  ['power-quality', 'Power Quality', [
    ['ahf', 'Active Harmonic Filter'],
    ['static-var-generator', 'Static Var Generator'],
    ['voltage-optimizers', 'Voltage Optimization'],
    ['uninterrupted-power-supply', 'Uninterrupted Power Supply'],
    ['power-quality-mobile-anlayser', 'Power Quality Mobile Analyser'],
  ]],
  ['hvac', 'HVAC', [
    ['heat-pumps', 'Heat Pumps System'],
    ['adsorption-chiller', 'Adsorption Chiller'],
    ['air-purifiers-smoke-filters', 'Air Purifiers / Smoke Filters'],
  ]],
  ['automation', 'Automation', [
    ['bms-servers-controllers', 'BMS Servers & Controllers'],
    ['sensors', 'Sensors'],
    ['power-supply', 'Power Supply'],
    ['smart-meters', 'Smart Meters'],
  ]],
  ['ev-chargers', 'EV Chargers', [
    ['360480kw-distributed-charger', '360~480kW Distributed Charger'],
    ['sec-200-240kw-integrated-charger', 'SEC 200-240kW Integrated Charger'],
    ['sec-series', 'SEC 60-160kW Integrated Charger'],
    ['sec-40-80kw-integrated-charger', 'SEC 40-80kW Integrated Charger'],
    ['interstellar-ac-charger', 'Interstellar AC Charger'],
    ['mira-ac-charger', 'Mira AC Charger'],
  ]],
];

/**
 * home: the homepage (the logo links back to the top).
 * top / current: the page's top-level section and its own slug. The section's menu link is marked
 * aria-current on its own page and .is-current below it; any product page marks the Products button.
 */
export default function Header({ home = false, top = null, current = null }) {
  const navLink = ([slug, label]) => {
    const mark = slug !== top ? {} : top === current ? { 'aria-current': 'page' } : { className: 'is-current' };
    return <li key={slug}><a href={`/${slug}/`} {...mark}>{label}</a></li>;
  };
  const [first, ...rest] = NAV;
  return (
    <header className="site-header" id="site-header">
      <div className="site-header__bar">
        <Brand home={home} />
        <nav className="primary-nav" aria-label="Main">
          <ul className="primary-nav__list">
            {navLink(first)}
            <li><button className={top === 'products' ? 'nav-trigger is-current' : 'nav-trigger'} type="button" aria-expanded="false" aria-controls="mega-products">Products<span className="nav-trigger__chev" aria-hidden="true" /></button></li>
            {rest.map(navLink)}
          </ul>
        </nav>
        <div className="site-header__actions">
          <a className="header-phone" href="tel:+97145686557">+971&nbsp;4&nbsp;568&nbsp;6557</a>
          <a className="btn btn--primary btn--sm" href="#contact" data-interest="Energy audit">Request an audit <Icon name="arrow" /></a>
          <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
            <span className="menu-toggle__text">Menu</span>
            <span className="menu-toggle__icon" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mega" id="mega-products" hidden>
        <div className="mega__inner">
          {PRODUCT_MENU.map(([slug, label, items]) => (
            <div className="mega__col" key={slug}>
              <h2 className="mega__title"><a href={`/${slug}/`}>{label}</a></h2>
              <ul>
                {items.map(([s, l]) => <li key={s}><a href={`/${s}/`}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mobile-menu" id="mobile-menu" hidden>
        <nav aria-label="Mobile">
          <ul className="mobile-menu__list">
            {navLink(first)}
            <li>
              <details className="mobile-menu__products">
                <summary>Products</summary>
                <div className="mobile-menu__groups">
                  {PRODUCT_MENU.flatMap(([slug, label, items]) => [
                    <a className="mobile-menu__group" href={`/${slug}/`} key={slug}>{label}</a>,
                    ...items.map(([s, l]) => <a href={`/${s}/`} key={s}>{l}</a>),
                  ])}
                </div>
              </details>
            </li>
            {rest.map(navLink)}
          </ul>
        </nav>
        <div className="mobile-menu__actions">
          <a className="btn btn--primary" href="#contact" data-interest="Energy audit">Request an audit <Icon name="arrow" /></a>
          <a className="mobile-menu__contact" href="tel:+97145686557"><Icon name="phone" />+971&nbsp;4&nbsp;568&nbsp;6557</a>
          <a className="mobile-menu__contact" href="https://wa.me/971525360124"><Icon name="whatsapp" />WhatsApp</a>
        </div>
      </div>
      <HeaderMenus />
      <LogoIntro />
    </header>
  );
}
