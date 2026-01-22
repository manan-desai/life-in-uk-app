# Contributing

Thank you for contributing! This is a community-driven project and we welcome all contributions.

## Ways to Contribute

- **Add Questions** - Expand the question bank
- **Report Bugs** - Found an issue? Let us know
- **Improve UI** - Make it better looking
- **Fix Answers** - Correct any mistakes

## Quick Start

```bash
# Fork the repo, then:
git clone https://github.com/manan-desai/life-in-uk-app.git
cd life-in-uk-app
yarn install
yarn dev
```

## Adding Questions

Add questions to:
- Official exams: `src/exam/exam-X.json`
- Practice tests: `src/test/test-X.json`

### Format

```json
{
  "question": "What is the capital city of the United Kingdom?",
  "options": [
    "London",
    "Edinburgh",
    "Cardiff",
    "Belfast"
  ],
  "correctAnswers": ["London"],
  "explanation": "London is the capital city of the United Kingdom and England. It is one of the world's most important financial and cultural centers."
}
```

**Multiple choice**: Include multiple items in `correctAnswers` array.

## Submitting

1. Test locally: `yarn dev`
2. Create a Pull Request
3. Describe what you changed

## Guidelines

- Use clear, simple language
- Base questions on official handbook
- Verify all facts
- Test your changes before submitting

---

Questions? Open an issue on GitHub!

