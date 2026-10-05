// About Energy Savers: shared by the homepage's About section and the About page.

export const ABOUT_LEDE = 'Energy Savers was established in 2013 as an FZE and has been operating as an on-shore company since 2020. We are pioneers in energy efficiency with more than 150 installations in power quality, automation and HVAC.';

export function Certs() {
  return (
    <ul className="certs">
      <li>
        <button className="cert" type="button" data-cert="iso">
          <img src="/assets/img/cert-iso-9001-360.webp" width="360" height="509" alt="" loading="lazy" decoding="async" />
          <span className="cert__name">ISO 9001:2015</span>
          <span className="cert__detail">MEP Engineering and Contracting</span>
        </button>
      </li>
      <li>
        <button className="cert" type="button" data-cert="deaas">
          <img src="/assets/img/cert-deaas-360.webp" width="360" height="509" alt="" loading="lazy" decoding="async" />
          <span className="cert__name">Dubai Energy Auditors Accreditation Scheme</span>
          <span className="cert__detail">Government of Dubai</span>
        </button>
      </li>
    </ul>
  );
}

export function Highlights() {
  return (
    <ul className="highlights">
      <li>First Solar Thermal Chiller installation in the UAE</li>
      <li>Hundreds of PQ installations in the region achieving savings &amp; regulatory compliance</li>
      <li>Multiple HVAC and SCADA installations in the UAE</li>
      <li>Represents top brands from across the globe in the region</li>
    </ul>
  );
}

export function Names() {
  return (
    <div className="names">
      <div className="names__group">
        <h3>Our suppliers</h3>
        <ul className="names__list names__list--suppliers">
          <li>Sinexcel</li>
          <li>Siemens</li>
          <li>Aermec</li>
          <li>Helmholz</li>
          <li>Condensator Dominit</li>
          <li>A. Eberle</li>
        </ul>
      </div>
      <div className="names__group">
        <h3>Our clients</h3>
        {/* TODO(owner): names read from the old site's logo files; confirm "EKC" and "Dubai Airports (DXB)". */}
        <ul className="names__list">
          <li>DEWA</li>
          <li>Dubai Municipality</li>
          <li>Dubai Customs</li>
          <li>Dubai Airports (DXB)</li>
          <li>DP World</li>
          <li>Emaar</li>
          <li>Nakheel</li>
          <li>Jumeirah Group</li>
          <li>Four Seasons</li>
          <li>Park Hyatt</li>
          <li>Grand Hyatt</li>
          <li>Mall of the Emirates</li>
          <li>Magic Planet</li>
          <li>Al Zahra Hospital Dubai</li>
          <li>Unilever</li>
          <li>IFFCO</li>
          <li>Agthia</li>
          <li>Al Ghurair</li>
          <li>Grand Mills</li>
          <li>RAK Ceramics</li>
          <li>ERCO Worldwide</li>
          <li>EKC</li>
        </ul>
      </div>
    </div>
  );
}
