# Controller Structure

This directory contains all the controllers for the API application. The controllers are organized as follows:

## Base Controller

The `Controller.php` class serves as the foundation for all controllers in the application. It provides standardized methods for:

- API responses
- Error handling
- Validation
- Pagination and sorting
- Date handling
- Search functionality

## CrudOperations Trait

The `Traits/CrudOperations.php` trait provides a reusable implementation of standard CRUD (Create, Read, Update, Delete) operations to avoid code duplication across controllers.

### How to Use the CrudOperations Trait

1. Import the trait in your controller:
```php
use App\Http\Controllers\Traits\CrudOperations;
```

2. Add the trait to your controller class:
```php
class YourController extends Controller
{
    use CrudOperations;
    
    // Define required properties...
}
```

3. Define the required properties:
```php
// The model class to use
protected $model = YourModel::class;

// The resource name for error messages
protected $resourceName = 'resource_name';

// Validation rules
protected $validationRules = [
    'field1' => 'required|string',
    'field2' => 'required|integer',
    // ...
];
```

4. Optional: Define relationships to be loaded automatically:
```php
protected function getDefaultRelationships(): array
{
    return ['relation1', 'relation2'];
}
```

5. Optional: Add lifecycle hooks for additional processing:
```php
protected function afterStore($record)
{
    // Custom logic after storing a record
}

protected function afterUpdate($record)
{
    // Custom logic after updating a record
}
```

### Available Methods from the Trait

The trait provides these methods automatically:
- `index()` - Get all records
- `paginate(Request $request)` - Get paginated list of records
- `show(int $id)` - Get a specific record
- `store(Request $request)` - Create a new record
- `update(Request $request, int $id)` - Update a record
- `destroy(int $id)` - Delete a record
- `count()` - Get count of records

### Overriding Default Methods

You can override any of these methods for controller-specific logic:

```php
public function store(Request $request): JsonResponse
{
    // Custom implementation
}
```

### Example for Custom Primary Key or Parameter

If your controller uses a parameter other than 'id', you can override the relevant methods:

```php
public function show(string $customParam): JsonResponse
{
    try {
        $record = YourModel::where('custom_field', $customParam)->first();
        if (!$record) {
            return $this->notFoundResponse($this->getResourceName());
        }
        return $this->successResponse($record, 'retrieved');
    } catch (Exception $e) {
        return $this->handleException($e);
    }
}
```

## API Controllers

Controllers in the `Api` namespace handle API endpoints. They extend the base `Controller` class and should use the `CrudOperations` trait for standard CRUD operations. 
