import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../../../context/ProductContext';
import { useSettings } from '../../../context/SettingsContext';
import {
  CATEGORIES, formatNaira, getPriceDisplay, getUnitPrice, getVariantLabel, isShrink, stockColor,
} from '../../../utils/products';

const PER_VARIANT = ['Bottles', 'Packing Bags']; // these get one card per size
const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none';
const newId = () => `v${Date.now()}`;

const settingsPrice = (category, s = {}) =>
  ({
    'Pure Water': s.pureWaterPricePerBag,
    Bottles: s.bottlesPricePerUnit,
    'Packing Bags': s.packingBagsPricePerUnit,
  }[category] ?? 0);

const buildCards = (products) =>
  products.flatMap((p) => {
    if (PER_VARIANT.includes(p.category)) {
      return p.variants.map((v) => ({
        key: `${p.id}-${v.id}`,
        product: p,
        variants: [v],
        title: `${getVariantLabel(p, v)} ${p.category === 'Bottles' ? 'PET bottle' : 'packing bags'}`,
        stock: v.stock || 0,
        unit: 'units',
        price: formatNaira(getUnitPrice(p, v)),
      }));
    }
    const stock = p.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    return [{
      key: String(p.id),
      product: p,
      variants: p.variants,
      title: p.name,
      stock,
      unit: isShrink(p) ? 'roll(s)' : 'bags',
      price: getPriceDisplay(p),
    }];
  });

export default function EcommerceManager() {
  const { products } = useProducts();
  const [tab, setTab] = useState('All');
  const [modal, setModal] = useState(null); // { type: 'add' | 'edit', productId, variantId?, variantIds? }
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const cards = useMemo(
    () => buildCards(products).filter((c) => tab === 'All' || c.product.category === tab),
    [products, tab]
  );

  const close = () => setModal(null);
  const done = (msg) => { setNotice(msg); close(); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">E-commerce manager</h1>
        <p className="text-gray-500 text-sm mt-1">Manage stock and prices exactly as customers see them.</p>
      </div>

      {notice && (
        <p role="status" className="bg-green-50 text-green-800 text-sm border border-green-100 rounded-lg px-4 py-3">
          {notice}
        </p>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            aria-pressed={tab === c}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
              tab === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-700 border-gray-200 hover:border-slate-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-500">No products in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <GoodsCard
              key={card.key}
              card={card}
              onAdd={() =>
                setModal({
                  type: 'add',
                  productId: card.product.id,
                  variantId: PER_VARIANT.includes(card.product.category) ? card.variants[0].id : null,
                })
              }
              onEdit={() =>
                setModal({ type: 'edit', productId: card.product.id, variantIds: card.variants.map((v) => v.id) })
              }
            />
          ))}
        </div>
      )}

      {modal?.type === 'add' && <AddGoodsModal key={`${modal.productId}-${modal.variantId}`} {...modal} onClose={close} onDone={done} />}
      {modal?.type === 'edit' && <EditModal key={modal.productId} {...modal} onClose={close} onDone={done} />}
    </div>
  );
}

/* ---------------- Card ---------------- */

function GoodsCard({ card, onAdd, onEdit }) {
  const { product, title, stock, unit, price } = card;
  const low = stock <= (isShrink(product) ? 1 : LOW_STOCK_THRESHOLD);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-10">
        {product.category}
      </span>
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img src={product.image} alt={title} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-700">{price}</p>
        <p className={`text-sm mt-1 mb-4 ${stockColor(low ? (stock === 0 ? 0 : 1) : 100)}`}>
          {stock} {unit} remaining{stock === 0 ? ' · out of stock' : low ? ' · low' : ''}
        </p>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <button onClick={onEdit} className="py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
          <button onClick={onAdd} className="py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">Add goods</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Modal shell ---------------- */

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    {children}
    {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
  </label>
);

const Footer = ({ children }) => (
  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">{children}</div>
);
const btnGhost = 'flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 text-gray-700';
const btnPrimary = 'flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed';

/* ---------------- Add goods ---------------- */

function AddGoodsModal({ productId, variantId, onClose, onDone }) {
  const { products, updateVariantStock, addVariant } = useProducts();
  const { settings } = useSettings();
  const product = products.find((p) => p.id === productId);

  const shrink = product ? isShrink(product) : false;
  const canChoose = !shrink && variantId == null && (product?.variants.length || 0) > 1;
  const initial = shrink ? 'roll' : variantId ?? (product?.variants.length === 1 ? product.variants[0].id : null);

  // target: null = choosing a size, 'new' = new size, 'roll' = shrink roll, otherwise an existing variant id
  const [target, setTarget] = useState(initial);
  const [form, setForm] = useState({ size: '', weight: '', rollType: 'Single', quantity: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (!product) return null;

  const qty = parseInt(form.quantity, 10);
  const weight = parseFloat(form.weight);
  const existing = product.variants.find((v) => v.id === target);
  const duplicateSize =
    target === 'new' &&
    product.variants.some((v) => String(getVariantLabel(product, v)).toLowerCase() === form.size.trim().toLowerCase());

  const perKg = settings?.shrinkWrapperPricePerKg ?? product.basePricePerKg ?? 0;
  const unitPrice = shrink ? Math.round((weight || 0) * perKg) : existing ? getUnitPrice(product, existing) : settingsPrice(product.category, settings);

  const valid =
    qty >= 1 &&
    (target !== 'new' || (form.size.trim() && !duplicateSize)) &&
    (target !== 'roll' || weight > 0);

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;

    if (target === 'roll') {
      const match = product.variants.find((v) => v.weightKg === weight && v.rollType === form.rollType);
      match
        ? updateVariantStock(product.id, match.id, (match.stock || 0) + qty)
        : addVariant(product.id, { id: newId(), rollType: form.rollType, weightKg: weight, stock: qty });
      return onDone(`Added ${qty} ${form.rollType.toLowerCase()} roll(s) of ${weight}kg to ${product.name}.`);
    }

    if (target === 'new') {
      addVariant(product.id, { id: newId(), size: form.size.trim(), pricePerPack: unitPrice, stock: qty });
      return onDone(`Created size ${form.size.trim()} with ${qty} in stock.`);
    }

    updateVariantStock(product.id, existing.id, (existing.stock || 0) + qty);
    onDone(`Added ${qty} to ${getVariantLabel(product, existing)}. New stock: ${(existing.stock || 0) + qty}.`);
  };

  // Step 1: choose a size
  if (target === null) {
    return (
      <Modal title="Select size" onClose={onClose}>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Choose a size to add stock to, or create a new one.</p>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setTarget(v.id)}
                className="p-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition text-left"
              >
                {getVariantLabel(product, v)}
                <span className="block text-xs text-gray-500 font-normal">{v.stock || 0} in stock</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setTarget('new')}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
          >
            + Create new size
          </button>
        </div>
        <Footer><button onClick={onClose} className={btnGhost}>Cancel</button></Footer>
      </Modal>
    );
  }

  // Step 2: details
  const title = target === 'new' ? 'Create new size' : shrink ? `Add rolls · ${product.name}` : 'Add stock';
  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="p-6 space-y-4">
          {existing && (
            <p className="text-sm text-gray-600">
              {product.name} · <strong>{getVariantLabel(product, existing)}</strong> · {existing.stock || 0} in stock now
            </p>
          )}

          {target === 'new' && (
            <Field label="New size name" hint={duplicateSize ? undefined : 'e.g. 2.8 or 800ml'}>
              <input autoFocus value={form.size} onChange={set('size')} className={inputCls} />
              {duplicateSize && <span className="block text-xs text-red-600 mt-1">That size already exists. Pick it from the list instead.</span>}
            </Field>
          )}

          {shrink && (
            <>
              <Field label="Weight (kg)">
                <input autoFocus type="number" min="0" step="any" value={form.weight} onChange={set('weight')} placeholder="e.g. 20.8" className={inputCls} />
              </Field>
              <Field label="Roll type">
                <select value={form.rollType} onChange={set('rollType')} className={inputCls}>
                  <option>Single</option>
                  <option>Double</option>
                </select>
              </Field>
            </>
          )}

          <Field label={shrink ? 'Number of rolls' : 'Quantity to add'}>
            <input type="number" min="1" step="1" value={form.quantity} onChange={set('quantity')} placeholder="How many?" className={inputCls} />
          </Field>

          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-100 space-y-1">
            <p>{shrink ? 'Price per roll' : 'Price per unit'}: <strong>{formatNaira(unitPrice)}</strong> <span className="text-blue-600">(from settings)</span></p>
            {existing && qty >= 1 && <p>Stock after: <strong>{(existing.stock || 0) + qty}</strong></p>}
          </div>
        </div>

        <Footer>
          {canChoose && <button type="button" onClick={() => setTarget(null)} className={btnGhost}>Back</button>}
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="submit" disabled={!valid} className={btnPrimary}>Save goods</button>
        </Footer>
      </form>
    </Modal>
  );
}

/* ---------------- Edit ---------------- */

function EditModal({ productId, variantIds, onClose, onDone }) {
  const { products, updateVariant, deleteVariant } = useProducts();
  const product = products.find((p) => p.id === productId);
  const [draft, setDraft] = useState({});

  if (!product) return null;
  const rows = product.variants.filter((v) => variantIds.includes(v.id));
  const shrink = isShrink(product);

  const val = (v, f) => draft[v.id]?.[f] ?? String(f === 'stock' ? v.stock || 0 : getUnitPrice(product, v));
  const change = (v, f) => (e) => setDraft((d) => ({ ...d, [v.id]: { ...d[v.id], [f]: e.target.value } }));

  const save = (e) => {
    e.preventDefault();
    rows.forEach((v) => {
      const patch = {};
      if (draft[v.id]?.stock !== undefined) patch.stock = Math.max(0, parseInt(draft[v.id].stock, 10) || 0);
      if (!shrink && draft[v.id]?.price !== undefined) patch.pricePerPack = Math.max(0, parseFloat(draft[v.id].price) || 0);
      if (Object.keys(patch).length) updateVariant(product.id, v.id, patch);
    });
    onDone(`Saved changes to ${product.name}.`);
  };

  const remove = (v) => {
    if (window.confirm(`Remove ${getVariantLabel(product, v)}? This can't be undone.`)) {
      deleteVariant(product.id, v.id);
      if (rows.length === 1) onClose();
    }
  };

  return (
    <Modal title={`Edit · ${product.name}`} onClose={onClose}>
      <form onSubmit={save}>
        <div className="p-6 space-y-3">
          {shrink && <p className="text-xs text-gray-500">Roll prices follow the per-kg rate, so only stock is editable here.</p>}
          {rows.map((v) => (
            <div key={v.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{getVariantLabel(product, v)}</span>
                <button
                  type="button"
                  onClick={() => remove(v)}
                  disabled={product.variants.length <= 1}
                  className="text-xs text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
              <div className={`grid gap-3 ${shrink ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <Field label="Stock">
                  <input type="number" min="0" value={val(v, 'stock')} onChange={change(v, 'stock')} className={inputCls} />
                </Field>
                {!shrink && (
                  <Field label="Price (₦)">
                    <input type="number" min="0" step="any" value={val(v, 'price')} onChange={change(v, 'price')} className={inputCls} />
                  </Field>
                )}
              </div>
            </div>
          ))}
        </div>
        <Footer>
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="submit" className={btnPrimary}>Save changes</button>
        </Footer>
      </form>
    </Modal>
  );
}
