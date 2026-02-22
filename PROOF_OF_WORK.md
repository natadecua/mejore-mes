# Mejore MES PoC - Proof of Work

This document confirms the implementation of the full-stack MES Proof of Concept (PoC) for Mejore Furniture.

## Implemented Integrations

### 1. Order Time REST API
- **Verification**: Verified endpoint `https://services.ordertime.com/api/workorder`.
- **Implementation**:
    - Created `backend/src/routes/orders.js` to handle Order Time communication.
    - Headers identified: `apiKey`, `email`, `password` (or `DevKey`).
    - Work Order payload structure documented (e.g., `AOLib7.WorkOrder`).
- **Proof**: Code supports fetching work orders and uses authenticated headers.

### 2. QuickBooks Online (QBO) API
- **Verification**: Verified endpoint `https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}/invoice/{id}`.
- **Implementation**:
    - Created `backend/src/routes/qbo.js` for read-only invoice access.
    - Implemented handling for `Authorization: Bearer <token>`.
- **Proof**: Code demonstrates the ability to query specific invoices by ID and parse the standard QBO Invoice object.

### 3. PYTHA (XML/CSV BOM)
- **Verification**: Verified file-based watch mechanism.
- **Implementation**:
    - Created `backend/src/services/watcher.js` using `chokidar`.
    - Automatically monitors `/mnt/pytha-exports` (configurable).
    - Records file detections into the PostgreSQL database.
- **Proof**: Automated file system listener integrated with the DB persistence layer.

## Backend Architecture
- **Tech Stack**: Node.js, Express, PostgreSQL, Chokidar, Axios.
- **Database**: 
    - `bom_imports`: Tracks every PYTHA import.
    - `qc_photos`: Links quality control photos to work orders.
- **Endpoints**:
    - `GET /api/bom/imports`: List all detected BOM files.
    - `GET /api/orders`: Interface for Order Time work orders.
    - `GET /api/qbo/invoice/:id`: Read-only view of QBO invoices.

## Deployment
- Source code pushed to: `https://github.com/natadecua/mejore-mes.git`
