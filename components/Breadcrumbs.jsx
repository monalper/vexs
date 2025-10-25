import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumbs" className="breadcrumbs">
      {items.map((item, idx) => (
        <span key={idx}>
          {idx > 0 && <span aria-hidden="true"> / </span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

