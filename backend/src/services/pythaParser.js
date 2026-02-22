// backend/src/services/pythaParser.js
// Parses PYTHA BOM exports (XML or CSV) into normalised JS objects
// Then maps them to OT BOM Component shape for push to Order Time

const xml2js = require('xml2js');
const { parse: csvParse } = require('csv-parse/sync');

/**
 * Parse a PYTHA XML BOM export.
 *
 * PYTHA XML structure (typical export):
 * <BOM>
 *   <Item name="CHAIR-001" description="Dining Chair" qty="1">
 *     <Component name="SEAT-PANEL" qty="1" material="Plywood 18mm" />
 *     <Component name="LEG-ASM"   qty="4" material="Beech Wood" />
 *   </Item>
 * </BOM>
 *
 * Returns array of { assemblyItem, components[] } ready to push to OT.
 */
async function parseXML(xmlString) {
  const parser = new xml2js.Parser({ explicitArray: true, mergeAttrs: true });
  const result = await parser.parseStringPromise(xmlString);

  const root = result.BOM || result.bom || result;
  const items = root.Item || root.item || [];

  return items.map(item => {
    const attrs = Array.isArray(item) ? item[0] : item;
    const components = (attrs.Component || attrs.component || []).map(c => {
      const ca = Array.isArray(c) ? c[0] : c;
      return {
        itemName:     ca.name?.[0] || ca.name || 'UNKNOWN',
        description:  ca.material?.[0] || ca.description?.[0] || '',
        quantityPer:  parseFloat(ca.qty?.[0] || ca.qty || 1),
        stepName:     'Default',
        uom:          'EA',
      };
    });

    return {
      assemblyItem: attrs.name?.[0] || attrs.name || 'ASSEMBLY',
      description:  attrs.description?.[0] || attrs.description || '',
      quantity:     parseFloat(attrs.qty?.[0] || attrs.qty || 1),
      components,
    };
  });
}

/**
 * Parse a PYTHA CSV BOM export.
 *
 * Expected CSV columns (adjust to actual PYTHA export):
 * assembly_item, component_item, description, qty_per, step, uom
 */
function parseCSV(csvString) {
  const rows = csvParse(csvString, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Group by assembly_item
  const grouped = {};
  for (const row of rows) {
    const key = row.assembly_item || row['Assembly Item'] || 'UNKNOWN';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      itemName:    row.component_item || row['Component Item'] || row.item || '',
      description: row.description    || row.Description || '',
      quantityPer: parseFloat(row.qty_per || row['Qty Per'] || row.qty || 1),
      stepName:    row.step           || row.Step || 'Default',
      uom:         row.uom            || row.UOM  || 'EA',
    });
  }

  return Object.entries(grouped).map(([assemblyItem, components]) => ({
    assemblyItem,
    quantity: 1,
    components,
  }));
}

/**
 * Auto-detect format and parse
 * @param {string} content  File content as string
 * @param {string} filename Used to detect XML vs CSV
 */
async function parseBOM(content, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'xml') return parseXML(content);
  if (ext === 'csv') return parseCSV(content);
  // Fallback: sniff content
  if (content.trim().startsWith('<')) return parseXML(content);
  return parseCSV(content);
}

module.exports = { parseBOM, parseXML, parseCSV };
