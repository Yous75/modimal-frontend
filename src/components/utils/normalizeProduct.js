// Converts one raw Product document from the backend (models/Product.js)
// into the flat shape the UI components expect (Sellercard, the various
// listing pages, etc). Every page that lists real products shares this
// one function instead of each re-inventing its own mapping.
export function normalizeProduct(product) {
  const sizeEntries = product.sizes || [];
  const colorEntries = product.colors || [];
  const tags = product.tags || [];

  return {
    id: product._id,
    title: product.title,
    subtitle: product.subtitle,
    price: product.price,
    image: product.images?.[0],
    images: product.images || [],
    colors: colorEntries.map((c) => c.hex),
    colorNames: colorEntries.map((c) => c.name),
    sizes: sizeEntries.map((s) => s.size),
    fabric: product.fabric,
    tags,
    isNew: tags.includes("New In"),
    isBestSeller: tags.includes("Best Seller"),
    isPlusSize: !!product.isPlusSize,
    inStock: sizeEntries.some((s) => s.stock > 0),
  };
}

// Applies normalizeProduct() to a whole list at once.
export function normalizeProducts(products = []) {
  return products.map(normalizeProduct);
}
