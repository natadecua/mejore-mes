#!/usr/bin/env bash
# Mejore MES — End-to-End API smoke tests (no DB required for mock mode)
# Run: bash test/smoke.sh
# Requires: curl, jq

BASE="http://localhost:3001"

echo "=== Mejore MES Smoke Tests ==="
echo ""

check() {
  local label=$1; local url=$2; local method=${3:-GET}; local data=$4
  echo -n "[$method] $label ... "
  if [ "$method" = "POST" ]; then
    code=$(curl -s -o /tmp/res.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
  else
    code=$(curl -s -o /tmp/res.json -w "%{http_code}" "$url")
  fi
  if [[ "$code" == "200" || "$code" == "201" ]]; then
    echo "✅ HTTP $code"
  else
    echo "❌ HTTP $code"
    cat /tmp/res.json
  fi
}

check "Health"                    "$BASE/"
check "List BOM imports"          "$BASE/api/bom/imports"
check "List work orders (mock)"   "$BASE/api/orders"
check "Single WO mock"            "$BASE/api/orders/101"
check "QBO Invoice (mock)"        "$BASE/api/qbo/invoice/1"
check "QBO cached invoices"       "$BASE/api/qbo/cached"
check "QC Photos list"            "$BASE/api/qc-photos"

echo ""
echo "=== BOM Upload Test (XML) ==="
code=$(curl -s -o /tmp/bom_res.json -w "%{http_code}" \
  -X POST "$BASE/api/bom/import" \
  -F "file=@../backend/test-exports/sample-bom.xml")
echo "Upload XML BOM: HTTP $code"
if [ "$code" = "201" ]; then
  echo "✅ Response:"
  jq '.assemblies, .totalComponents' /tmp/bom_res.json 2>/dev/null
else
  cat /tmp/bom_res.json
fi

echo ""
echo "=== Create Work Order (mock) ==="
code=$(curl -s -o /tmp/wo_res.json -w "%{http_code}" \
  -X POST "$BASE/api/orders" \
  -H "Content-Type: application/json" \
  -d '{"ItemRef":{"Name":"CHAIR-001"},"QuantityOrdered":10,"PromiseDate":"2026-03-01","Memo":"Test WO from MES"}')
echo "Create WO: HTTP $code"
jq '.' /tmp/wo_res.json 2>/dev/null | head -20

echo ""
echo "Done."
