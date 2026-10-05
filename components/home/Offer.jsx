import Solutions from './Solutions';
import Services from './Services';

// Solutions and services side by side, each under its own original heading.
export default function Offer() {
  return (
    <section className="offer" id="solutions" aria-labelledby="solutions-title">
      <Solutions />
      <Services />
    </section>
  );
}
