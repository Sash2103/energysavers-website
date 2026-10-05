// A case's improvement workplan, drawn as a single-line diagram: starting point → steps → result.
// The current runs along it once in view (components/behaviour/Workplans.jsx).
export default function Workplan({ caption, steps }) {
  return (
    <figure className="workplan" data-workplan="">
      <figcaption className="workplan__caption">{caption}</figcaption>
      <ol className="workplan__steps">
        {steps.map((s, i) => (
          <li className={s.kind ? `wp wp--${s.kind}` : 'wp'} key={i}>
            {s.kind === 'start' && <span className="vh">Starting point: </span>}
            {s.kind === 'end' && <span className="vh">Result: </span>}
            <span className="wp__label">{s.label}</span>
            {(s.values || []).map((v, j) => typeof v === 'string'
              ? <span className="wp__value" key={j}>{v}</span>
              // a figure the owner still has to confirm, shown as a dashed placeholder
              : <span className="wp__value wp__value--todo" key={j}>{v.todo}</span>)}
          </li>
        ))}
      </ol>
    </figure>
  );
}
