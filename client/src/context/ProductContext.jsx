import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { products as seed } from '../data/mockData';

// Shared by the storefront and the admin panel, so admin edits show up on the shop.
// Swap the internals for API calls when the backend exists; components won't change.
const ProductContext = createContext(null);
const KEY = 'ss_products';

const read = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) && parsed.length ? parsed : seed;
  } catch {
    return seed;
  }
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(products));
    } catch {
      /* ignore */
    }
  }, [products]);

  const addProduct = useCallback((product) => {
    setProducts((prev) => {
      const id = prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      return [{ ...product, id }, ...prev];
    });
  }, []);

  const deleteProduct = useCallback((id) => setProducts((prev) => prev.filter((p) => p.id !== id)), []);

  const updateVariantStock = useCallback((productId, variantId, stock) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, stock) } : v)) }
          : p
      )
    );
  }, []);

  const mapProduct = (productId, fn) =>
    setProducts((prev) => prev.map((p) => (p.id === productId ? fn(p) : p)));

  const addVariant = useCallback(
    (productId, variant) => mapProduct(productId, (p) => ({ ...p, variants: [...p.variants, variant] })),
    []
  );

  const updateVariant = useCallback(
    (productId, variantId, patch) =>
      mapProduct(productId, (p) => ({
        ...p,
        variants: p.variants.map((v) => (v.id === variantId ? { ...v, ...patch } : v)),
      })),
    []
  );

  // A product always keeps at least one variant
  const deleteVariant = useCallback(
    (productId, variantId) =>
      mapProduct(productId, (p) =>
        p.variants.length > 1 ? { ...p, variants: p.variants.filter((v) => v.id !== variantId) } : p
      ),
    []
  );

  const resetProducts = useCallback(() => setProducts(seed), []);

  const value = useMemo(
    () => ({ products, addProduct, deleteProduct, updateVariantStock, addVariant, updateVariant, deleteVariant, resetProducts }),
    [products, addProduct, deleteProduct, updateVariantStock, addVariant, updateVariant, deleteVariant, resetProducts]
  );
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => useContext(ProductContext);
