# I18n (Internationalization) Lens

Check for internationalization readiness and common i18n issues.

## Focus areas

### 1. Hardcoded strings
User-facing text that should be translatable.

**Examples**:
```typescript
// ❌ Hardcoded English strings
function UserGreeting({ name }) {
  return <h1>Welcome back, {name}!</h1>;
}

// ✅ Translatable
function UserGreeting({ name }) {
  return <h1>{t('greeting.welcome_back', { name })}</h1>;
}
```

```typescript
// ❌ Hardcoded error messages
if (!email.includes('@')) {
  throw new Error('Invalid email address');
}

// ✅ Translatable error
if (!email.includes('@')) {
  throw new Error(t('errors.invalid_email'));
}
```

### 2. Date formatting
Dates should use locale-aware formatting.

**Examples**:
```typescript
// ❌ Hardcoded US format
const dateStr = `${month}/${day}/${year}`;

// ✅ Locale-aware
const dateStr = new Intl.DateTimeFormat(locale).format(date);
// or
const dateStr = date.toLocaleDateString(locale);
```

### 3. Currency formatting
Currency should use locale-aware formatting with proper symbols.

**Examples**:
```typescript
// ❌ Hardcoded dollar sign
const price = `$${amount.toFixed(2)}`;

// ✅ Locale-aware with currency
const price = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'USD'
}).format(amount);
```

### 4. Number formatting
Numbers should respect locale (commas vs periods).

**Examples**:
```typescript
// ❌ Hardcoded formatting
const num = 1234.56;
const formatted = '1,234.56';

// ✅ Locale-aware
const formatted = new Intl.NumberFormat(locale).format(num);
// en-US: "1,234.56"
// de-DE: "1.234,56"
```

### 5. Pluralization
Plural forms vary by language.

**Examples**:
```typescript
// ❌ Simple pluralization
const msg = count === 1 ? '1 item' : `${count} items`;

// ✅ Locale-aware pluralization (using i18next or similar)
const msg = t('items.count', { count });
// en.json: { "items": { "count_one": "{{count}} item", "count_other": "{{count}} items" } }
// pl.json: { "items": { "count_one": "{{count}} przedmiot", "count_few": "{{count}} przedmioty", "count_many": "{{count}} przedmiotów" } }
```

### 6. String concatenation
Avoid building sentences by concatenating translated fragments.

**Examples**:
```typescript
// ❌ Concatenation breaks grammar in some languages
const msg = t('welcome') + ', ' + name + '!';
// In languages with different word order, this breaks

// ✅ Interpolation with placeholders
const msg = t('greeting.welcome', { name });
// en.json: "Welcome, {{name}}!"
// ar.json: "مرحبا {{name}}!" (name at end)
```

### 7. Text direction (RTL)
Support right-to-left languages.

**Examples**:
```css
/* ❌ Hardcoded left/right */
.sidebar {
  float: left;
  margin-right: 20px;
}

/* ✅ Logical properties */
.sidebar {
  float: inline-start;
  margin-inline-end: 20px;
}
```

```html
<!-- ❌ Fixed direction -->
<html lang="en">

<!-- ✅ Direction from language -->
<html lang="{{lang}}" dir="{{dir}}">
```

### 8. Locale-specific content
Images, icons, and symbols may have different meanings across cultures.

**Examples**:
```typescript
// ❌ Hardcoded flag emoji for language
const lang = '🇺🇸 English';

// ✅ Text only or locale-specific icons
const lang = t('languages.english');
```

### 9. Time zones
Display times in user's local timezone.

**Examples**:
```typescript
// ❌ Server timezone
const eventTime = new Date(event.timestamp).toString();

// ✅ User's timezone
const eventTime = new Date(event.timestamp).toLocaleString(userLocale, {
  timeZone: userTimezone
});
```

### 10. Sort order
Sorting should respect locale-specific collation.

**Examples**:
```typescript
// ❌ ASCII sorting (breaks accented characters)
names.sort();

// ✅ Locale-aware collation
names.sort((a, b) => a.localeCompare(b, locale));
```

### 11. Form validation
Validation should accept international formats.

**Examples**:
```typescript
// ❌ US-only phone validation
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

// ✅ International phone validation
import { parsePhoneNumber } from 'libphonenumber-js';
const phone = parsePhoneNumber(input, defaultCountry);
if (!phone?.isValid()) {
  throw new Error(t('errors.invalid_phone'));
}
```

### 12. Character encoding
Ensure proper UTF-8 encoding.

**Examples**:
```typescript
// ❌ ASCII-only assumptions
const length = str.length; // Breaks with emojis and multi-byte chars

// ✅ Proper string handling
const length = Array.from(str).length; // Counts code points correctly
```

## Common i18n libraries

- **i18next**: Feature-rich i18n framework
- **react-i18next**: React bindings for i18next
- **FormatJS (react-intl)**: ICU message format
- **LinguiJS**: Minimal footprint, compile-time extraction
- **vue-i18n**: Vue.js i18n plugin

## Patterns to flag

### Always flag
- User-facing strings not wrapped in translation function
- Hardcoded date/currency/number formatting
- String concatenation for dynamic messages
- Simple `count === 1 ? 'item' : 'items'` pluralization

### Flag if targeting international markets
- Fixed text direction (left/right vs inline-start/end)
- Locale-specific validation (phone, postal code)
- Images with embedded text
- Hardcoded sort order

### Don't flag
- Developer-facing messages (console.log, error stack traces)
- URLs, API endpoints
- Code identifiers, class names
- Temporary prototypes or internal tools

## False positives to avoid

- Enum values, constants, config keys (not user-facing)
- HTML attributes that aren't displayed (id, class, data-*)
- Translation keys themselves
- Debug/development-only strings

## Severity guidelines

**Important** (should fix):
- User-facing strings not translatable
- Hardcoded date/currency formatting
- Broken pluralization
- String concatenation building sentences

**Minor** (nice to fix):
- Missing RTL support (if not targeting RTL languages)
- Non-locale-aware sorting
- Timezone handling (if app is local-only)

**Blocking**: Rarely blocking unless the app is marketed as multilingual.

## Review checklist

For each file in the diff:

- [ ] Are user-facing strings wrapped in translation function?
- [ ] Are dates formatted with Intl.DateTimeFormat or equivalent?
- [ ] Are currencies formatted with Intl.NumberFormat?
- [ ] Is pluralization handled with proper i18n library?
- [ ] Are sentences using interpolation, not concatenation?
- [ ] Are CSS properties using logical equivalents (inline-start vs left)?
- [ ] Are form validations accepting international formats?
- [ ] Are sorts using localeCompare?

## i18n setup checklist

For a new i18n implementation, verify:

- [ ] i18n library installed and configured
- [ ] Translation files structure defined
- [ ] Locale detection mechanism (browser, user preference, URL)
- [ ] Fallback locale defined
- [ ] Number/date/currency formatting configured
- [ ] Pluralization rules configured
- [ ] RTL support (if needed)

## Resources

- i18next documentation: https://www.i18next.com/
- Intl API reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
- Unicode CLDR (locale data): https://cldr.unicode.org/
- ICU message format: https://unicode-org.github.io/icu/userguide/format_parse/messages/

## Reporting format

```json
{
  "file": "src/components/Checkout.tsx",
  "line": 42,
  "severity": "important",
  "description": "Hardcoded English string should be translatable",
  "evidence": "Line 42: 'Total: $99.99' should use t('checkout.total', { amount }) with Intl.NumberFormat for currency"
}
```

Each finding must include:
- Exact file and line number
- Severity (important or minor)
- Specific i18n principle violated
- Suggested fix with example

## Language-specific considerations

### Common translation pitfalls

**English → Chinese**:
- Chinese has no spaces between words
- No pluralization (use counters/classifiers)
- Date format: YYYY年MM月DD日

**English → Arabic**:
- Right-to-left (RTL) text direction
- Different numerals (Eastern Arabic 0-9: ٠١٢٣٤٥٦٧٨٩)
- Pluralization: zero/one/two/few/many/other

**English → German**:
- Compound words (one English word = long German compound)
- Formal/informal (Sie/du)
- Number format: 1.234,56 (period for thousands, comma for decimal)

**English → Japanese**:
- Multiple writing systems (Hiragana, Katakana, Kanji)
- Politeness levels
- Date format: YYYY年MM月DD日

Flag hardcoded assumptions that break in these languages.
