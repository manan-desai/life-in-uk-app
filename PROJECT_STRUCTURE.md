# Project Structure

This document explains the professional, modular code structure of the Life in UK Test application.

## Directory Layout

```
src/
├── components/           # Reusable UI components
│   ├── Header.jsx       # Top navigation bar with GitHub link
│   ├── Footer.jsx       # Footer with links and clear data
│   ├── Layout.jsx       # Wrapper component with header/footer
│   ├── CompletionScreen.jsx  # Test completion results
│   ├── QuestionCard.jsx      # Question display with options
│   ├── FeatureCard.jsx       # Homepage feature showcase
│   ├── ExamGrid.jsx          # Exam selection grid
│   ├── TestGrid.jsx          # Test selection grid
│   └── ContributeSection.jsx # Open source contribution CTA
│
├── pages/               # Route-level page components
│   ├── ExamPage.jsx    # Main test/exam taking page
│   ├── ReviewPage.jsx  # Review incorrect answers
│   └── FlaggedPage.jsx # Review flagged questions
│
├── ui/                  # Base UI primitives
│   ├── button.jsx      # Button component
│   ├── checkbox.jsx    # Checkbox component
│   └── radio-group.jsx # Radio button group
│
├── exam/                # Exam question data (JSON)
│   └── exam-1.json to exam-17.json
│
├── test/                # Practice test data (JSON)
│   └── test-1.json to test-73.json
│
├── App.jsx              # Root app with routing (clean!)
├── HomePage.jsx         # Landing page
├── allQuestions.js      # Question data aggregator
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## Component Hierarchy

```
App.jsx (Router)
  └── Layout.jsx
      ├── Header.jsx
      ├── [Page Content]
      │   ├── HomePage.jsx
      │   │   ├── FeatureCard.jsx
      │   │   ├── ExamGrid.jsx
      │   │   ├── TestGrid.jsx
      │   │   └── ContributeSection.jsx
      │   │
      │   ├── ExamPage.jsx
      │   │   ├── QuestionCard.jsx
      │   │   └── CompletionScreen.jsx
      │   │
      │   ├── ReviewPage.jsx
      │   └── FlaggedPage.jsx
      │
      └── Footer.jsx
```

## Key Benefits of This Structure

### 1. **Separation of Concerns**
- **Components**: Reusable UI pieces
- **Pages**: Route-specific logic
- **UI**: Base design system elements

### 2. **Easy to Maintain**
- Each component has a single responsibility
- Changes to header don't affect footer
- Adding features doesn't bloat existing files

### 3. **Scalability**
- Easy to add new pages
- Simple to create new components
- Clear where to put new code

### 4. **Testability**
- Small, focused components are easier to test
- Mock dependencies cleanly
- Test in isolation

### 5. **Developer Experience**
- Clear file organization
- Intuitive naming
- Easy to find what you need

## Component Descriptions

### Layout Components

**Header.jsx**
- Top navigation with logo
- GitHub link integration
- Navigation menu
- Sticky positioning

**Footer.jsx**
- Quick navigation links
- Clear data functionality
- Copyright and license info

**Layout.jsx**
- Wraps all pages with header and footer
- Ensures consistent layout
- Manages flex layout for sticky footer

### Page Components

**HomePage.jsx**
- Landing page
- Composes multiple components
- Entry point for users

**ExamPage.jsx**
- Main test-taking interface
- State management for quiz logic
- Uses QuestionCard and CompletionScreen

**ReviewPage.jsx**
- Shows failed questions
- Filter by test ID
- Track retry attempts

**FlaggedPage.jsx**
- Shows flagged questions
- Similar UX to ReviewPage

### Reusable Components

**QuestionCard.jsx**
- Displays question and options
- Handles answer selection
- Shows feedback and explanations
- Navigation between questions

**CompletionScreen.jsx**
- Shows final score
- Pass/fail indicator (75% threshold)
- Actions: review, retry, home

**ExamGrid.jsx / TestGrid.jsx**
- Grid layout for test selection
- Shows completion status
- Clickable cards

**FeatureCard.jsx**
- Simple card for features
- Icon, title, description

**ContributeSection.jsx**
- Open source CTA
- GitHub links
- Contribution encouragement

## Import/Export Pattern

All components use ES6 module syntax:

```javascript
// Export
export default function ComponentName() { ... }

// Import
import ComponentName from './components/ComponentName';
```

## State Management

- **Local State**: React useState hooks
- **Persistence**: localStorage for progress
- **Props**: Passed down from parent components
- **No external state library**: Keeps it simple

## Routing Structure

```
/                   → HomePage
/exam/:examId       → ExamPage
/test/:testId       → ExamPage
/review             → ReviewPage
/flagged            → FlaggedPage
```

## Adding New Features

### To add a new page:
1. Create in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Add navigation link in Header or Footer

### To add a new component:
1. Create in `src/components/NewComponent.jsx`
2. Import where needed
3. Pass props as needed

### To add new questions:
1. Edit JSON files in `src/exam/` or `src/test/`
2. Follow existing format
3. No code changes needed!

## Best Practices

✅ **Do:**
- Keep components small and focused
- Use clear, descriptive names
- Extract repeated UI into components
- Keep business logic in page components
- Keep UI components pure/presentational

❌ **Don't:**
- Put everything in one file
- Mix concerns in components
- Repeat code across files
- Create deeply nested structures
- Over-engineer simple components

## Performance Considerations

- Components are lazy-loaded by React Router
- localStorage reduces server calls (none needed!)
- Minimal re-renders with proper state management
- Optimized with React 19 features

---

This structure is production-ready and follows React best practices!

