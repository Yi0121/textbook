# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # TypeScript type-check + Vite production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Architecture Overview

This is an **Interactive Textbook Editor** - an educational web application for teachers and students featuring rich text editing, drawing tools, AI assistance, and classroom collaboration.

### Tech Stack
- React 19 + TypeScript + Vite (rolldown-vite)
- TailwindCSS for styling
- Tiptap for rich text editing
- EPUB.js for textbook import
- Lucide React for icons

### State Management (Context + Reducer Pattern)

Four context providers in `src/context/`:
- **EditorContext** - Drawing tools, strokes, mind maps, AI memos, user role, selection state
- **ContentContext** - Textbook content (Tiptap JSON), EPUB data, AI processing state
- **UIContext** - Panel visibility, widget modes (spotlight/curtain), toolbar positioning
- **CollaborationContext** - Whiteboard state, participants, collaboration mode

### Component Structure

```
src/components/
├── canvas/         # TextbookEditor, DrawingLayer, DraggableMindMap, AIMemoCard
├── features/       # Dashboard, EPUBImporter, LuckyDraw, ClassroomWidgets
├── layout/         # TopNavigation, RightSidePanel
├── tools/          # FixedToolbar, tool-related components
├── ui/             # Modal, SelectionFloatingMenu, Timer, WelcomeTour
└── collaboration/  # Whiteboard
```

### Key Files

- `src/App.tsx` - Main orchestrator, handles viewport/zoom, AI interactions, keyboard shortcuts
- `src/config/toolConfig.ts` - Tool definitions, role-based toolbar configuration
- `src/hooks/useCanvasInteraction.ts` - Mouse/touch drawing logic
- `src/hooks/useKeyboardShortcuts.ts` - Keyboard command binding
- `src/utils/epubParser.ts` - EPUB file parsing

### User Roles

Two roles with different permissions defined in `toolConfig.ts`:
- **Teacher**: Full editing, AI tools, class management, analytics dashboard
- **Student**: Limited tools, AI tutor access only

### Canvas System

The editor uses layered rendering:
1. Tiptap rich text editor (TextbookEditor)
2. SVG drawing layer for pen/highlighter strokes (DrawingLayer)
3. Draggable objects (mind maps, AI memos, text boxes)

Drawing coordinates are calculated relative to the viewport with zoom support.
