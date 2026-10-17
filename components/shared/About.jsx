// About Energy Savers: shared by the homepage (About, Key highlights) and the About page.
import Pic from '@/lib/pic';

export const ABOUT_LEDE = 'Energy Savers was established in 2013 as an FZE and has been operating as an on-shore company since 2020. We are pioneers in energy efficiency with more than 150 installations in power quality, automation and HVAC.';

export function Certs() {
  return (
    <ul className="certs">
      <li>
        <button className="cert" type="button" data-cert="iso">
          <Pic src="/assets/img/cert-iso-9001-360.webp" width="360" height="509" alt="" loading="lazy" decoding="async" />
          <span className="cert__name">ISO 9001:2015</span>
          <span className="cert__detail">MEP Engineering and Contracting</span>
        </button>
      </li>
      <li>
        <button className="cert" type="button" data-cert="deaas">
          <Pic src="/assets/img/cert-deaas-360.webp" width="360" height="509" alt="" loading="lazy" decoding="async" />
          <span className="cert__name">Dubai Energy Auditors Accreditation Scheme</span>
          <span className="cert__detail">Government of Dubai</span>
        </button>
      </li>
    </ul>
  );
}

export const HIGHLIGHTS = [
  'First Solar Thermal Chiller installation in the UAE',
  'Hundreds of PQ installations in the region achieving savings & regulatory compliance',
  'Multiple HVAC and SCADA installations in the UAE',
  'Represents top brands from across the globe in the region',
];

export const SUPPLIERS = ['Sinexcel', 'Siemens', 'Aermec', 'Helmholz', 'Condensator Dominit', 'A. Eberle'];

// TODO(owner): names read from the old site's logo files; confirm "EKC" and "Dubai Airports (DXB)".
export const CLIENTS = [
  'DEWA', 'Dubai Municipality', 'Dubai Customs', 'Dubai Airports (DXB)', 'DP World', 'Emaar', 'Nakheel',
  'Jumeirah Group', 'Four Seasons', 'Park Hyatt', 'Grand Hyatt', 'Mall of the Emirates', 'Magic Planet',
  'Al Zahra Hospital Dubai', 'Unilever', 'IFFCO', 'Agthia', 'Al Ghurair', 'Grand Mills', 'RAK Ceramics',
  'ERCO Worldwide', 'EKC',
];

export function Highlights() {
  return (
    <ul className="highlights">
      {HIGHLIGHTS.map(h => <li key={h}>{h}</li>)}
    </ul>
  );
}

export function Names() {
  return (
    <div className="names">
      <div className="names__group">
        <h3>Our suppliers</h3>
        <ul className="names__list names__list--suppliers">
          {SUPPLIERS.map(n => <li key={n}>{n}</li>)}
        </ul>
      </div>
      <div className="names__group">
        <h3>Our clients</h3>
        <ul className="names__list">
          {CLIENTS.map(n => <li key={n}>{n}</li>)}
        </ul>
      </div>
    </div>
  );
}
