# Error Handling System

This directory contains utilities for handling errors in the application, with a focus on internationalization (i18n) support.

## Translation Utilities (`translationUtils.jsx`)

The `translationUtils.jsx` file provides utilities for translating error messages from the backend to the current language.

### Key Components

#### Error Codes

The `ERROR_CODES` object centralizes all error codes and their corresponding translation keys. This makes it easy to maintain and update error messages across the application.

```javascript
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'login.error.invalidCredentials',
  AUTH_USER_NOT_FOUND: 'login.error.userNotFound',
  // ...
};
```

#### Error Patterns

The `ERROR_PATTERNS` object maps backend error messages to error codes. This allows us to translate backend error messages to the current language.

```javascript
export const ERROR_PATTERNS = {
  // Authentication errors
  'Invalid credentials': ERROR_CODES.AUTH_INVALID_CREDENTIALS,
  'User not found': ERROR_CODES.AUTH_USER_NOT_FOUND,
  // ...
};
```

#### Translation Functions

- `translateBackendMessage(message, defaultMessage)`: Translates a backend error message to the current language.
- `translateValidationErrors(errors)`: Translates validation errors from the backend.
- `standardizeError(error)`: Standardizes error responses from the API.

## Usage

### Frontend

1. Import the necessary functions from `translationUtils.jsx`:

```javascript
import { standardizeError, ERROR_CODES } from '../utils/translationUtils.jsx';
```

2. Use the `standardizeError` function to handle API errors:

```javascript
try {
  const response = await apiServices.postData('/login', loginData);
  // Handle success
} catch (error) {
  const standardizedError = standardizeError(error);
  setErrorKey(standardizedError.message);
}
```

3. Use the `ERROR_CODES` object to reference error codes:

```javascript
setErrorKey(ERROR_CODES.AUTH_NO_TOKEN);
```

### Backend

1. Import the `ErrorController`:

```php
use App\Http\Controllers\Api\ErrorController;
```

2. Use the static methods to handle errors:

```php
// Handle authentication errors
return ErrorController::handleAuthError('AUTH_USER_NOT_FOUND');

// Handle validation errors
return ErrorController::handleValidationError($e);

// Handle server errors
return ErrorController::handleServerError($e);
```

## Adding New Error Codes

1. Add the error code to the `ERROR_CODES` object in `translationUtils.jsx`.
2. Add the corresponding translation key to the language files (e.g., `en.json`, `fr.json`).
3. Add the error pattern to the `ERROR_PATTERNS` object in `translationUtils.jsx`.
4. Add the error code to the `ERROR_CODES` constant in `ErrorController.php`.

## Benefits

- **Centralized Error Handling**: All error codes and patterns are defined in one place.
- **Consistent Error Messages**: Error messages are consistent across the application.
- **Internationalization Support**: Error messages are translated to the current language.
- **Standardized Error Responses**: Error responses from the API are standardized.
- **Easy Maintenance**: Adding new error codes and patterns is straightforward. 