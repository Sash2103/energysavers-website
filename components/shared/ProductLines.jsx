import { href, LINE_OF_KEY, PRODUCT_KEYS } from '@/lib/site';

// The four product lines. On the homepage the photo and product names open the product sheet;
// on the Products page they link to the line and product pages.
const LINES = [
  {
    key: "pq",
    product: "ahf",
    label: "Power Quality products",
    img: { src: "/assets/img/p-ahf-700.webp", srcSet: "/assets/img/p-ahf-400.webp 400w, /assets/img/p-ahf-700.webp 700w",
      sizes: "(min-width: 960px) 22vw, 70vw", width: 700, height: 518, alt: "" },
    name: "Power Quality",
    text: "Power quality is a term used to describe the measurement of the quality and reliability of power provided by an electrical system.",
    products: [
      ["ahf", "Active Harmonic Filter"],
      ["svg", "Static Var Generator"],
      ["oskar", "Voltage Optimization"],
      ["ups", "Uninterrupted Power Supply"],
      ["pq-mobile", "Power Quality Mobile Analyser"],
    ],
  },
  {
    key: "hvac",
    product: "heat-pump",
    label: "HVAC products",
    img: { src: "/assets/img/p-heat-pump-839.webp", srcSet: "/assets/img/p-heat-pump-420.webp 420w, /assets/img/p-heat-pump-839.webp 839w",
      sizes: "(min-width: 960px) 22vw, 70vw", width: 839, height: 523, alt: "" },
    name: "HVAC",
    text: "HVAC stands for Heating, Ventilation, and Air Conditioning. It is a system used to regulate the temperature, humidity, and air quality in a building or space.",
    products: [
      ["heat-pump", "Heat Pumps System"],
      ["adsorption", "Adsorption Chiller"],
      ["air-purifier", "Air Purifiers / Smoke Filters"],
    ],
  },
  {
    key: "auto",
    product: "bms",
    label: "Automation products",
    img: { src: "/assets/img/line-automation-960.webp", srcSet: "/assets/img/line-automation-480.webp 480w, /assets/img/line-automation-960.webp 960w",
      sizes: "(min-width: 960px) 22vw, 70vw", width: 960, height: 715, alt: "" },
    name: "Automation",
    text: "Automation SCADA (Supervisory Control and Data Acquisition) is a type of software used to acquire data from remote locations and monitor and control industrial systems and processes.",
    products: [
      ["bms", "BMS Servers & Controllers"],
      ["sensors", "Sensors"],
      ["power-supply", "Power Supply"],
      ["smart-meters", "Smart Meters"],
    ],
  },
  {
    key: "ev",
    product: "ev-360-480",
    label: "EV charger products",
    img: { src: "/assets/img/p-ev-360-480-662.webp", srcSet: "/assets/img/p-ev-360-480-400.webp 400w, /assets/img/p-ev-360-480-662.webp 662w",
      sizes: "(min-width: 960px) 22vw, 70vw", width: 662, height: 472, alt: "" },
    name: "EV Chargers",
    text: "EV charging solutions: everything about profitability and charging experience.",
    products: [
      ["ev-360-480", "360~480kW Distributed Charger"],
      ["ev-200-240", "SEC 200-240kW Integrated Charger"],
      ["ev-60-160", "SEC 60-160kW Integrated Charger"],
      ["ev-40-80", "SEC 40-80kW Integrated Charger"],
      ["ev-interstellar", "Interstellar AC Charger"],
      ["ev-mira", "Mira AC Charger"],
    ],
  },
];

export default function ProductLines({ page = false }) {
  return (
    <div className="bench__shelf">
      {LINES.map(l => {
        const img = <img src={l.img.src} srcSet={l.img.srcSet} sizes={l.img.sizes} width={l.img.width} height={l.img.height} alt={l.img.alt} loading="lazy" decoding="async" />;
        const line = href(LINE_OF_KEY[l.key]);
        return (
          <article className="line" data-line={l.key} key={l.key}>
            {page
              ? <a className="line__media" href={line} aria-label={l.label}>{img}</a>
              : <button className="line__media" type="button" data-product={l.product} aria-label={l.label}>{img}</button>}
            <div className="line__text">
              {page
                ? <h2 className="line__name"><a href={line}>{l.name}</a></h2>
                : <h3 className="line__name">{l.name}</h3>}
              <p>{l.text}</p>
              <ul className="line__products">
                {l.products.map(([key, label]) => (
                  <li key={key}>
                    {page
                      ? <a href={href(PRODUCT_KEYS[key])}>{label}</a>
                      : <button type="button" data-product={key}>{label}</button>}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
