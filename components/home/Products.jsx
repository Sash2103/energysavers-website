import ProductLines from '@/components/shared/ProductLines';

// The product bench: the four lines, each opening the product sheet.
export default function Products() {
  return (
    <section className="bench" id="products" aria-labelledby="products-title">
      <div className="wrap">
        <h2 className="section-title" id="products-title">Our products</h2>
        <ProductLines />
      </div>
    </section>
  );
}
