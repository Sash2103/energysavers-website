import Icon from '@/components/shared/Icon';
import ServiceCards from '@/components/shared/ServiceCards';
import Rail from '@/components/behaviour/Rail';

export default function Services() {
  return (
    <div className="services" id="services">
      <div className="wrap services__head">
        <h2 className="section-title" id="services-title">Our services</h2>
        <div className="rail-controls" data-rail-controls="services-rail">
          <p className="rail-controls__count" aria-hidden="true"><span data-rail-index="">01</span> / 05</p>
          <button className="rail-controls__btn" type="button" data-rail-prev="" aria-label="Previous service"><Icon name="arrow" /></button>
          <button className="rail-controls__btn" type="button" data-rail-next="" aria-label="Next service"><Icon name="arrow" /></button>
        </div>
      </div>
      <ServiceCards />
      <div className="wrap rail-dots" data-rail-dots="services-rail" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <Rail id="services-rail" />
    </div>
  );
}
