// Shown only when the page is still loading after 400ms (see the before-paint script in app/layout.jsx).
export default function Loader() {
  return (
    <div className="loader" id="loader" aria-hidden="true">
      <svg className="mark mark--loader" viewBox="0 0 228 228" aria-hidden="true">
        <rect className="mark__sq" x="0" y="0" width="112" height="112" />
        <rect className="mark__sq" x="116" y="0" width="112" height="112" />
        <rect className="mark__sq" x="116" y="116" width="112" height="112" />
        <rect className="mark__sq" x="0" y="116" width="112" height="112" />
      </svg>
    </div>
  );
}
