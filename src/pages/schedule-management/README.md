# Schedule Management Pages

## Overview
This directory contains the admin schedule management interface for the conference management system.

## Components

### ScheduleManagementPage.tsx
Main page component with tab navigation between Global Events and Technical Sessions.

**Usage:**
```tsx
import { ScheduleManagementPage } from '@/pages/schedule-management';

// In your router
<Route path="/admin/schedule" element={<ScheduleManagementPage />} />
```

### GlobalEventsTab.tsx
Manage conference-wide events like registration, keynotes, breaks, etc.

**Features:**
- List all global events
- Create new events with title, time, and location
- Edit existing events
- Delete events with confirmation
- Form validation

### TechnicalSessionsTab.tsx
Manage technical sessions with nested papers.

**Features:**
- List all technical sessions with expandable paper lists
- Create/edit sessions with title, time slot, room, and chairs
- Add/edit/delete individual papers within sessions
- Display paper metadata (ID, title, authors)
- CSV import capability
- Form validation

### CSVImportModal.tsx
Import papers from CSV files.

**CSV Format:**
```csv
Session ID,Paper ID,Paper Title,Authors
ts-example-001,P-001,"Machine Learning in Healthcare","John Doe, Jane Smith"
ts-example-001,P-002,"Deep Learning Applications","Alice Johnson"
```

**Features:**
- File upload with drag-and-drop
- CSV validation
- Preview before import
- Detailed error reporting
- Template download

## Data Services

All data operations use functions from `@/services/scheduleService.ts`:

- `getAllGlobalEvents()` - Get all global events
- `saveGlobalEvent()` - Create a new global event
- `updateGlobalEvent()` - Update an existing global event
- `deleteGlobalEvent()` - Delete a global event
- `getAllTechnicalSessions()` - Get all technical sessions
- `saveTechnicalSession()` - Create a new technical session
- `updateTechnicalSession()` - Update an existing technical session
- `deleteTechnicalSession()` - Delete a technical session
- `addPaperToSession()` - Add a paper to a session
- `updatePaper()` - Update a paper
- `deletePaper()` - Delete a paper
- `importPapersFromCSV()` - Import papers from CSV data

## Types

All types are defined in `@/types/index.ts`:

- `GlobalEvent` - Global event data structure
- `TechnicalSession` - Technical session data structure
- `Paper` - Paper data structure
- `CSVImportResult` - CSV import result with errors
- `CSVImportError` - Individual CSV import error

## Styling

Components use the existing UI component library:
- `Card` - Container component
- `Button` - Action buttons with variants
- `Input` / `Textarea` - Form inputs with validation
- `Modal` - Modal dialogs with animations

## Error Handling

All components include proper error handling:
- Form validation with inline error messages
- Confirmation dialogs for destructive actions
- Try-catch blocks for async operations
- User-friendly error messages

## Future Enhancements

Potential improvements:
- Drag-and-drop paper reordering
- Bulk operations
- Export to CSV
- Session templates
- Conflict detection (time/room overlaps)
