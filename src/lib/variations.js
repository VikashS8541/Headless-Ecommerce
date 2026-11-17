/** "Color: Red, Size: M" -> { Color: 'Red', Size: 'M' } */
export function parseVariation(text = '') {
  const out = {}
  text.split(/,\s*/).forEach(part => {
    const i = part.indexOf(':')
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim()
  })
  return out
}

/** Turns the Store API variation list into [{ id, attrs, prices, inStock }] */
export const normaliseVariations = list =>
  (list || []).map(v => ({ id: v.id, attrs: parseVariation(v.variation), prices: v.prices, inStock: v.is_in_stock, low: v.low_stock_remaining }))

/** The variation that matches every chosen option, or undefined. */
export const findVariation = (variations, chosen) =>
  variations.find(v => Object.entries(v.attrs).every(([k, val]) => !val || chosen[k] === val))

/** Can this option still be bought, given what is already chosen? (used to strike out sold-out sizes) */
export const optionAvailable = (variations, attrName, value, chosen) =>
  variations.some(v =>
    v.inStock
    && (!v.attrs[attrName] || v.attrs[attrName] === value)
    && Object.entries(chosen).every(([k, val]) => k === attrName || !v.attrs[k] || v.attrs[k] === val),
  )
