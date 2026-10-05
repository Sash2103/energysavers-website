import Icon from '@/components/shared/Icon';
import Enquiry from '@/components/behaviour/Enquiry';

// The contact section at the end of every page. page: the Contact page's own version.
export default function Contact({ page = false }) {
  return (
    <section className={page ? 'contact contact--page on-ink' : 'contact on-ink'} id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div className="contact__info">
          <h2 className="section-title" id="contact-title">Get in <span className="accent">touch</span></h2>
          <a className="contact__phone" href="tel:+97145686557">+971&nbsp;4&nbsp;568&nbsp;6557</a>
          <div className="offices">
            <section className="office" aria-labelledby="office-uae">
              <h3 className="office__title" id="office-uae">Office address UAE</h3>
              <address>Energy Savers Technical Services LLC<br />1103, Opal Tower, Business Bay<br />Dubai, UAE · PO Box 126723</address>
              <ul className="office__lines">
                <li><Icon name="phone" /><a href="tel:+97145686557">+971&nbsp;4&nbsp;568&nbsp;6557</a></li>
                <li><Icon name="phone" /><a href="tel:+971525360124">+971&nbsp;52&nbsp;536&nbsp;0124</a></li>
                <li><Icon name="mail" /><a href="mailto:sales@energysavers.me">sales@energysavers.me</a></li>
                <li><Icon name="pin" /><a href="https://www.google.com/maps/search/?api=1&amp;query=Opal+Tower+Business+Bay+Dubai">Map <Icon name="external" className="i--sm" /></a></li>
              </ul>
            </section>
            <section className="office" aria-labelledby="office-ksa">
              <h3 className="office__title" id="office-ksa">Office address KSA</h3>
              <address>Energy Savers Global Company<br />Office no. 20, Building 8, Al Wurud<br />Olaya Street, Andalus Mall, Riyadh, KSA</address>
              <ul className="office__lines">
                <li><Icon name="phone" /><a href="tel:+966539935609">+966&nbsp;53&nbsp;993&nbsp;5609</a></li>
                <li><Icon name="mail" /><a href="mailto:admin.ksa@energysavers.me">admin.ksa@energysavers.me</a></li>
                <li><Icon name="pin" /><a href="https://www.google.com/maps/search/?api=1&amp;query=Andalus+Mall+Olaya+Street+Al+Wurud+Riyadh">Map <Icon name="external" className="i--sm" /></a></li>
              </ul>
            </section>
          </div>
        </div>
        {/* No backend: the form opens the visitor's email app or WhatsApp with the message filled in. */}
        <form className="enquiry" id="enquiry" noValidate>
          <div className="field">
            <label htmlFor="f-name">Name</label>
            <input id="f-name" name="name" type="text" autoComplete="name" required />
            <p className="field__error" id="f-name-error" hidden>Please enter your name.</p>
          </div>
          <div className="field">
            <label htmlFor="f-email">Email</label>
            <input id="f-email" name="email" type="email" autoComplete="email" required />
            <p className="field__error" id="f-email-error" hidden>Please enter a valid email address.</p>
          </div>
          <div className="field">
            <label htmlFor="f-interest">Interested in</label>
            <select id="f-interest" name="interest">
              <option>Energy audit</option>
              <option>Power quality audit</option>
              <option>Product enquiry</option>
              <option>Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-message">Message</label>
            <textarea id="f-message" name="message" rows="5" required />
            <p className="field__error" id="f-message-error" hidden>Please enter a message.</p>
          </div>
          <div className="enquiry__actions">
            <button className="btn btn--primary" type="submit" name="via" value="email"><Icon name="mail" />Send by email</button>
            <button className="btn btn--outline" type="submit" name="via" value="whatsapp"><Icon name="whatsapp" />Send on WhatsApp</button>
          </div>
          <Enquiry />
        </form>
      </div>
    </section>
  );
}
