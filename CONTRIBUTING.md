# Contributing to Weather Analytics Dashboard

Thank you for your interest in contributing to the Weather Analytics Dashboard! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Weather-Analytics-Dashboard.git
   cd Weather-Analytics-Dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file:
   ```bash
   cp .env.example .env
   # Add your OpenWeatherMap API key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test thoroughly

3. Run linting:
   ```bash
   npm run lint
   ```

4. Build the project to ensure no build errors:
   ```bash
   npm run build
   ```

5. Commit your changes with a clear message:
   ```bash
   git commit -m "Add: description of your changes"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request with a clear description of changes

## Code Style Guidelines

- Use functional components with Hooks
- Follow existing code formatting and structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Use Redux for global state, local state for component-specific data

## Component Structure

When creating new components:

```jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const dispatch = useDispatch();
  const stateValue = useSelector(state => state.slice.value);
  const [localState, setLocalState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // handler logic
  };

  // Render
  return (
    <div className="component-name">
      {/* component JSX */}
    </div>
  );
};

export default ComponentName;
```

## Redux Guidelines

- Use Redux Toolkit's `createSlice` for state management
- Keep slices focused on a specific domain
- Use async thunks for API calls
- Include selectors for complex state derivations

## CSS Guidelines

- Use BEM-like naming convention
- Keep styles scoped to components
- Use CSS variables for theme colors (if adding)
- Ensure responsive design for all screen sizes
- Test on different browsers

## Testing

Currently, the project doesn't have automated tests. When adding tests:

- Place test files next to the components they test
- Name test files: `ComponentName.test.jsx`
- Test user interactions, not implementation details
- Mock API calls in tests

## Types of Contributions

### Bug Fixes
- Clearly describe the bug in your PR
- Include steps to reproduce
- Add screenshots if applicable

### New Features
- Discuss the feature in an issue first
- Keep features focused and atomic
- Update documentation as needed
- Add appropriate styling

### Documentation
- Fix typos and clarify instructions
- Add examples where helpful
- Keep documentation up-to-date with code changes

### Performance Improvements
- Provide benchmarks showing improvement
- Ensure no functionality is broken
- Consider edge cases

## Pull Request Guidelines

### PR Title
Use clear, descriptive titles:
- `Fix: resolve temperature conversion bug`
- `Add: implement dark mode toggle`
- `Improve: optimize API caching strategy`
- `Docs: update installation instructions`

### PR Description
Include:
1. What changes were made
2. Why the changes were necessary
3. How to test the changes
4. Screenshots (for UI changes)
5. Related issues (if any)

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Linting passes without errors
- [ ] Build completes successfully
- [ ] Tested on multiple browsers (if UI change)
- [ ] Tested responsive design (if UI change)
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings

## Feature Requests

To request a feature:
1. Check if it already exists in issues
2. Open a new issue with "Feature Request" label
3. Describe the feature and use case
4. Explain why it would be valuable

## Bug Reports

To report a bug:
1. Check if it's already reported
2. Open a new issue with "Bug" label
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos if applicable
   - Browser/OS information
   - Console errors

## Questions or Need Help?

- Open an issue with "Question" label
- Provide context about what you're trying to do
- Include relevant code snippets

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Collaborate openly

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Recognition

Contributors will be acknowledged in the project. Significant contributions may be highlighted in release notes.

Thank you for contributing! 🎉
