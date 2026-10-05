import Icon from '@/components/shared/Icon';
import ProductSheetControls from '@/components/behaviour/ProductSheetControls';

// The product quick-view sheet. Each product links to its full page; chips switch between the products of a line.
export default function ProductSheet() {
  return (
    <dialog className="sheet sheet--product" id="product-sheet" aria-labelledby="product-sheet-title">
      <div className="sheet__bar">
        <p className="sheet__line" id="product-sheet-line" />
        <button className="sheet__close" type="button" data-close=""><Icon name="close" /><span className="vh">Close</span></button>
      </div>
      <div className="sheet__chips" id="product-chips" role="group" aria-label="Products in this line" />
      <div className="sheet__body">
        <article className="product" id="product-ahf" data-line="Power Quality" hidden>
          <div className="product__media"><img src="/assets/img/p-ahf-700.webp" srcSet="/assets/img/p-ahf-400.webp 400w, /assets/img/p-ahf-700.webp 700w" sizes="(min-width: 900px) 34vw, 86vw" width="700" height="518" alt="Active harmonic filter modules" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/ahf/">Active Harmonic Filter<Icon name="arrow" /></a></h2>
            <p className="product__models">AHF · AHF Pro</p>
            <p>Active Harmonic Filter Pro is a software-based harmonic filtering system that eliminates harmonic distortion caused by non-linear loads in an electrical system.</p>
            <p>Intelligent FFT is an iterative FFT algorithm based on Sinexcel updated computing power and ten years of experience in field harmonic waveform database.</p>
            <ul className="specs">
              <li>Intelligent Fast Fourier Transform</li>
              <li>Plug suite: AHF unit with plug suite, monitoring system and alarm indication lights</li>
              <li>IEEE 519 harmonic control</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Active Harmonic Filter">Contact us</a>
              <a className="text-link" href="https://www.energysavers.me/wp-content/uploads/2022/12/IEEE-519-Harmonic-standard.pdf">IEEE 519 standard (PDF) <Icon name="external" /></a>
            </div>
          </div>
        </article>
        <article className="product" id="product-svg" data-line="Power Quality" hidden>
          <div className="product__media"><img src="/assets/img/p-svg-200.webp" width="200" height="200" alt="Static var generator module" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/static-var-generator/">Static Var Generator<Icon name="arrow" /></a></h2>
            <p className="product__models">SVG · SVG Pro · ASVG</p>
            <p>Static Var Generator (SVG) is an electrical device used in power systems for controlling reactive power and system voltage. It is used for rapidly injecting or absorbing reactive power in order to maintain system voltage within desired limits.</p>
            <ul className="specs">
              <li>Improves PF value to 0.99 within 15ms</li>
              <li>Inverter based technology</li>
              <li>Digital &amp; semiconductor control</li>
              <li>Intelligent compensation</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Static Var Generator">Contact us</a>
              <a className="text-link" href="https://www.energysavers.me/wp-content/uploads/2023/02/IEEE-519-Harmonic-standard-1.pdf">IEEE 519 standard (PDF) <Icon name="external" /></a>
            </div>
          </div>
        </article>
        <article className="product" id="product-oskar" data-line="Power Quality" hidden>
          <div className="product__media product__media--tall"><img src="/assets/img/p-oskar-267.webp" width="267" height="682" alt="OSKAR voltage optimisation cabinet" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/voltage-optimizers/">Voltage Optimization<Icon name="arrow" /></a></h2>
            <p className="product__models">OSKAR</p>
            {/* TODO(owner): the old page credits OSKAR to Schneider Electric with an unusual acronym expansion; OSKAR appears to be an A. Eberle product. Left out until confirmed. */}
            <p>Voltage dips in the electrical power supply are one of the main reasons for expensive unscheduled production outages. Voltage optimization is achieved by reducing the voltage at the building’s electrical entry point, allowing the facility to consume less energy while maintaining the same level of service.</p>
            <ul className="specs">
              <li>Powerful adaptive regulation</li>
              <li>Alarms when the voltage falls outside predetermined levels</li>
              <li>Detailed reporting on energy consumption and demand</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Voltage Optimization (OSKAR)">Contact us</a>
              <a className="text-link" href="https://www.energysavers.me/wp-content/uploads/2023/03/OSKAR_Voltage-Stabilizer.pdf">Datasheet (PDF) <Icon name="external" /></a>
            </div>
          </div>
        </article>
        <article className="product" id="product-ups" data-line="Power Quality" hidden>
          <div className="product__media"><img src="/assets/img/p-ups-200.webp" width="200" height="200" alt="Uninterrupted power supply cabinet" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/uninterrupted-power-supply/">Uninterrupted Power Supply<Icon name="arrow" /></a></h2>
            <p className="product__models">UPS</p>
            <p>An Uninterrupted Power Supply (UPS) is a device that provides emergency power to electrical equipment when the primary power source fails.</p>
            <ul className="specs">
              <li>Single phase in and single phase out: 1~20kVA</li>
              <li>Three phase in and three phase out: 1~30kVA</li>
              <li>Three phase in and single phase out: 1~30kVA</li>
              <li>97% high efficiency on-line mode</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Uninterrupted Power Supply">Contact us</a>
              <a className="text-link" href="https://www.energysavers.me/wp-content/uploads/2023/03/Sinexcel-UPS-Solutions-Brochure-V03-210824-Data-Sheet.pdf">Datasheet (PDF) <Icon name="external" /></a>
            </div>
          </div>
        </article>
        <article className="product" id="product-pq-mobile" data-line="Power Quality" hidden>
          <div className="product__media"><img src="/assets/img/p-pq-mobile-1124.webp" srcSet="/assets/img/p-pq-mobile-480.webp 480w, /assets/img/p-pq-mobile-1124.webp 1124w" sizes="(min-width: 900px) 34vw, 86vw" width="1124" height="859" alt="PQ-Box mobile power quality analyser" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/power-quality-mobile-anlayser/">Power Quality Mobile Analyser<Icon name="arrow" /></a></h2>
            <p className="product__models">PQ-Box 50 · PQ-Box 150 · PQ-Box 200 · PQ-Box 300</p>
            <p>Power Quality Mobile Analyzer is a handheld device used to analyze the power quality of an electrical system. It measures and records voltage, current, frequency, power factor, harmonics, and other power quality parameters.</p>
            <ul className="specs">
              <li>Power quality analyzers with fault recorder function</li>
              <li>WLAN interface for cableless communication with the software &amp; app</li>
              <li>Permanent recording of frequencies up to 170 kHz</li>
              <li>Free analysis software WinPQ mobile</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Power Quality Mobile Analyser">Contact us</a>
              <a className="text-link" href="https://www.energysavers.me/wp-content/uploads/2023/03/Technical-Datasheet.pdf">Datasheet (PDF) <Icon name="external" /></a>
            </div>
          </div>
        </article>
        <article className="product" id="product-heat-pump" data-line="HVAC" hidden>
          <div className="product__media"><img src="/assets/img/p-heat-pump-839.webp" srcSet="/assets/img/p-heat-pump-420.webp 420w, /assets/img/p-heat-pump-839.webp 839w" sizes="(min-width: 900px) 34vw, 86vw" width="839" height="523" alt="Heat pump unit" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/heat-pumps/">Heat Pumps System<Icon name="arrow" /></a></h2>
            <p>A heat pump is a device that transfers heat energy from a source of heat to what is called a thermal reservoir. Heat pumps are used to provide heating, cooling, and hot water to buildings in the form of space heating, air conditioning, and domestic hot water.</p>
            <ul className="specs">
              <li>Higher coefficient of performance (COP)</li>
              <li>Replaces boilers/calorifiers</li>
              <li>Simultaneous heating and cooling</li>
              <li>ROI less than 12 months in most cases</li>
              <li>Can be integrated into an existing SCADA network</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Heat Pumps System">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-adsorption" data-line="HVAC" hidden>
          <div className="product__media product__media--tall"><img src="/assets/img/p-adsorption-277.webp" width="277" height="460" alt="eCoo adsorption chiller" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/adsorption-chiller/">Adsorption Chiller<Icon name="arrow" /></a></h2>
            <p className="product__models">eCoo 20 ST · eCoo 20X · eCoo 30X · eCoo 30</p>
            <p>An adsorption chiller is a type of cooling system that uses an adsorbent material to absorb and store a refrigerant, such as water vapor, and then releases it to provide cooling. Our cooling systems are based on the innovative adsorption cooling process. In this way, they turn existing heat into cold.</p>
            <ul className="specs">
              <li>Electricity savings of up to 80% for the entire system are possible</li>
              <li>Only pure water is used as refrigerant</li>
              <li>The cooling modules contain no moving parts</li>
              <li>Hot water temperature 50–95 °C · Chilled water temperature 8–21 °C</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Adsorption Chiller">Contact us</a>
              <a className="text-link" href="https://www.energysavers.me/wp-content/uploads/2023/03/Data-Sheet-eCoo-40X-201905-1.pdf">Datasheet (PDF) <Icon name="external" /></a>
            </div>
          </div>
        </article>
        <article className="product" id="product-air-purifier" data-line="HVAC" hidden>
          <div className="product__media"><img src="/assets/img/p-air-purifier-369.webp" width="369" height="409" alt="Ceiling air purifier shown with its filter and grille separated" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/air-purifiers-smoke-filters/">Air Purifiers / Smoke Filters<Icon name="arrow" /></a></h2>
            <p>Air purifiers or smoke filters are devices that remove pollutants from the air in a room or building. They usually use a fan to draw air in, pass it through a filter, and then return the filtered air back into the room.</p>
            <ul className="specs">
              <li>HEPA filters: capture particles of 0.3 microns or larger</li>
              <li>Activated carbon filters: remove smell, chemicals, smoke and other pollutants</li>
              <li>UV lights: kill bacteria, viruses and other microorganisms</li>
              <li>Ionizers: reduce airborne particles such as dust and smoke</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Air Purifiers / Smoke Filters">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-bms" data-line="Automation" hidden>
          <div className="product__media product__media--photo"><img src="/assets/img/p-bms-250.webp" width="250" height="200" alt="BMS server and controller hardware" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/bms-servers-controllers/">BMS Servers &amp; Controllers<Icon name="arrow" /></a></h2>
            <p>BMS Servers &amp; Controllers are server and controller systems used to monitor and control building management systems (BMS). BMS systems are used to manage heating, ventilation, air conditioning, lighting, security, and access control systems in commercial and residential buildings.</p>
            <ul className="specs">
              <li>Improved energy efficiency</li>
              <li>Automated maintenance</li>
              <li>Increased safety</li>
              <li>Enhanced comfort</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="BMS Servers &amp; Controllers">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-sensors" data-line="Automation" hidden>
          <div className="product__media product__media--photo"><img src="/assets/img/p-sensors-517.webp" width="517" height="345" alt="Industrial sensors used in SCADA systems" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/sensors/">Sensors<Icon name="arrow" /></a></h2>
            <p>Sensors in SCADA automations are components of the automation system that measure physical conditions such as temperature, pressure, and flow. They provide input to the SCADA system, which can then be used to control and monitor processes.</p>
            <ul className="specs">
              <li>Temperature, pressure, humidity, flow, light and vibration sensors</li>
              <li>Real-time monitoring of the system to detect any abnormalities</li>
              <li>Automated control of processes</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Sensors">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-power-supply" data-line="Automation" hidden>
          <div className="product__media product__media--photo"><img src="/assets/img/p-power-supply-450.webp" width="450" height="297" alt="DIN-rail power supply units" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/power-supply/">Power Supply<Icon name="arrow" /></a></h2>
            <p>Power supply in SCADA automation is a system that provides power to the SCADA system, including all of its components, such as computers, remote terminal units, and programmable logic controllers.</p>
            <ul className="specs">
              <li>Increased reliability and efficiency</li>
              <li>Improved safety</li>
              <li>Cost savings</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Power Supply">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-smart-meters" data-line="Automation" hidden>
          <div className="product__media product__media--photo"><img src="/assets/img/p-smart-meters-513.webp" width="513" height="374" alt="Smart energy meter" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/smart-meters/">Smart Meters<Icon name="arrow" /></a></h2>
            <p>A smart meter is an electronic device that records energy consumption of a home or business in intervals of an hour or less and communicates that information at least daily back to the utility for monitoring and billing purposes. Smart meters enable two-way communication between the meter and the central system.</p>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Smart Meters">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-ev-360-480" data-line="EV Chargers" hidden>
          <div className="product__media"><img src="/assets/img/p-ev-360-480-662.webp" srcSet="/assets/img/p-ev-360-480-400.webp 400w, /assets/img/p-ev-360-480-662.webp 662w" sizes="(min-width: 900px) 34vw, 86vw" width="662" height="472" alt="Sinexcel distributed charger: power bank and user terminal" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/360480kw-distributed-charger/">360~480kW Distributed Charger<Icon name="arrow" /></a></h2>
            <p>Flexible charging brings customers profitability and better user experience.</p>
            <ul className="specs">
              <li>Power bank: AC to DC power conversion, 24×20kW power modules, capacity from 360 to 480kW</li>
              <li>One power bank supports 3 user terminals</li>
              <li>10 minutes charging, 400 kilometers driving</li>
              <li>Liquid cooled user terminal noise &lt;55dB</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="360~480kW Distributed Charger">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-ev-200-240" data-line="EV Chargers" hidden>
          <div className="product__media"><img src="/assets/img/p-ev-200-240-373.webp" width="373" height="347" alt="SEC 200-240kW integrated charger" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/sec-200-240kw-integrated-charger/">SEC 200-240kW Integrated Charger<Icon name="arrow" /></a></h2>
            <p>SEC 240kW charger is an integrated solution, with power flexibly distributed to two connectors simultaneously, controlled by an intelligent algorithm that realizes high-performance EV charging.</p>
            <ul className="specs">
              <li>Output voltage 200-1000V, constant output voltage 300-1000V</li>
              <li>0% to 80% SOC within 20 minutes</li>
              <li>Peak efficiency of 96%</li>
              <li>IP55, IK10 rating enclosure</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="SEC 200-240kW Integrated Charger">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-ev-60-160" data-line="EV Chargers" hidden>
          <div className="product__media"><img src="/assets/img/p-ev-60-160-373.webp" width="373" height="347" alt="SEC 60-160kW integrated charger" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/sec-series/">SEC 60-160kW Integrated Charger<Icon name="arrow" /></a></h2>
            <p>Sinexcel has developed the innovative constant power technology: a reliable 60-160kW flexible configuration, a convenient power extension, and components for high availability and reliability to cover multiple applications such as hotels and hospitals.</p>
            <ul className="specs">
              <li>Ultra wide output voltage range 200V-1000V</li>
              <li>300V-1000V constant power dual output segment</li>
              <li>Power expansion reserved to 180kW</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="SEC 60-160kW Integrated Charger">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-ev-40-80" data-line="EV Chargers" hidden>
          <div className="product__media"><img src="/assets/img/p-ev-40-80-373.webp" width="373" height="347" alt="SEC 40-80kW integrated charger" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/sec-40-80kw-integrated-charger/">SEC 40-80kW Integrated Charger<Icon name="arrow" /></a></h2>
            <p>Sinexcel SEC 80kW charger is equipped with 2 DC charging connectors, which support output at a maximum of 1000V and 80kW full power. To charge more EVs at the same time, a Type 2 connector with 22kW is optional.</p>
            <ul className="specs">
              <li>Output voltage 200-1000V</li>
              <li>Peak efficiency of 96%</li>
              <li>Connector options: CCS2+CCS2+Type2, CCS2+CHAdeMO+Type2, CCS2+CHAdeMO</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="SEC 40-80kW Integrated Charger">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-ev-interstellar" data-line="EV Chargers" hidden>
          <div className="product__media"><img src="/assets/img/p-ev-interstellar-373.webp" width="373" height="347" alt="Interstellar AC wall charger" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/interstellar-ac-charger/">Interstellar AC Charger<Icon name="arrow" /></a></h2>
            <p className="product__models">7kW · 22kW</p>
            <p>Stronger design, better charging experience.</p>
            <ul className="specs">
              <li>IMD technology casing: scratch-resistant and corrosion-resistant</li>
              <li>Ring-shaped breathing light shows the charging status in blue, red and green</li>
              <li>EV cable management system</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Interstellar AC Charger">Contact us</a>
            </div>
          </div>
        </article>
        <article className="product" id="product-ev-mira" data-line="EV Chargers" hidden>
          <div className="product__media"><img src="/assets/img/p-ev-mira-373.webp" width="373" height="347" alt="Mira AC charger" loading="lazy" decoding="async" /></div>
          <div className="product__text">
            <h2 className="product__name"><a href="/mira-ac-charger/">Mira AC Charger<Icon name="arrow" /></a></h2>
            <p className="product__models">7kW</p>
            <p>Mira is an intelligent AC charger for residential charging use which features a smaller size design with a maximum output of 7kW.</p>
            <ul className="specs">
              <li>7kW level 2 AC charger, with 32A output (single phase)</li>
              <li>IP65 · IK09</li>
              <li>Compatible with all electric vehicles and plug-in hybrid vehicles</li>
            </ul>
            <div className="product__actions">
              <a className="btn btn--primary" href="#contact" data-enquire="Mira AC Charger">Contact us</a>
            </div>
          </div>
        </article>
      </div>
      <ProductSheetControls />
    </dialog>
  );
}
