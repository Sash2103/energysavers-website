// Accumulated figures and the carbon offset statement, at the top of the proof section.
export default function Stats() {
  return (
    <div className="proof__head">
      {/* TODO(owner): confirm the three accumulated figures and the "+". 64,236 t CO2 for 331 GWh implies ~0.19 t/MWh, about half the usual UAE grid factor. */}
      <dl className="figures">
        <div className="figures__cell">
          <dt>Accumulated energy reduction</dt>
          <dd><span className="figures__num">331+</span><span className="figures__unit">GWh</span></dd>
        </div>
        <div className="figures__cell">
          <dt>Accumulated CO<sub>2</sub> abatement</dt>
          <dd><span className="figures__num">64,236+</span><span className="figures__unit">tons</span></dd>
        </div>
        <div className="figures__cell">
          <dt>Accumulated cost savings</dt>
          <dd><span className="figures__unit figures__unit--pre">AED</span><span className="figures__num">67,040,000+</span></dd>
        </div>
      </dl>
      <div className="offset">
        <h2 className="offset__title"><span className="offset__label">Carbon offset</span> Let us make it <span className="accent">together</span></h2>
        <div className="offset__body">
          <p>Through carbon offset projects we reduce emissions, invest in environment projects and help us transition to a net zero economy.</p>
          <p className="offset__claims"><span>100% Happy Customers</span><span>Experienced Team</span></p>
        </div>
      </div>
    </div>
  );
}
