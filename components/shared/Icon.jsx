// An icon from the inline SVG sprite (components/site/Sprite.jsx)
export default function Icon({ name, className }) {
  return (
    <svg className={className ? `i ${className}` : 'i'} aria-hidden="true"><use href={`#i-${name}`} /></svg>
  );
}
