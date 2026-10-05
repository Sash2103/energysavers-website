import Icon from '@/components/shared/Icon';
import CertControls from '@/components/behaviour/CertControls';

// The certificate lightbox, opened from the certificate thumbnails (homepage and About page).
export default function CertViewer() {
  return (
    <dialog className="lightbox" id="cert-lightbox" aria-label="Certificate">
      <button className="sheet__close lightbox__close" type="button" data-close=""><Icon name="close" /><span className="vh">Close</span></button>
      <figure className="lightbox__fig" data-cert-view="iso" hidden>
        <img src="/assets/img/cert-iso-9001-724.webp" width="724" height="1024" alt="ISO 9001:2015 certificate of registration for Energy Savers Technical Services LLC, scope MEP Engineering and Contracting" loading="lazy" decoding="async" />
        <figcaption>ISO 9001:2015 · MEP Engineering and Contracting</figcaption>
      </figure>
      <figure className="lightbox__fig" data-cert-view="deaas" hidden>
        <img src="/assets/img/cert-deaas-724.webp" width="724" height="1024" alt="Certificate of accreditation under the Dubai Energy Auditors Accreditation Scheme for Energy Savers Technical Services LLC" loading="lazy" decoding="async" />
        <figcaption>Dubai Energy Auditors Accreditation Scheme · Government of Dubai</figcaption>
      </figure>
      <CertControls />
    </dialog>
  );
}
