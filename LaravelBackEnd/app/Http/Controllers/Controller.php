<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

/**
 * Base Controller Class
 * 
 * This class serves as the foundation for all API controllers in the application.
 * It provides standardized methods for handling API responses, errors, validation,
 * pagination, sorting, and other common controller operations.
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Load messages from JSON file
     * 
     * @return array Loaded messages
     */
    protected function loadMessages(): array
    {
        return json_decode(file_get_contents(resource_path('lang/en/messages.json')), true);
    }

    /**
     * Retrieve a message from the messages array
     * 
     * @param string $type Message type ('success' or 'error')
     * @param string $category Message category (e.g., 'validation', 'auth')
     * @param string $key Specific message key
     * @return string The message text or default error message if not found
     * 
     * @example getMessage('error', 'validation', 'required') // Returns: "Required fields are missing"
     */
    protected function getMessage(string $type, string $category, string $key = 'general'): string
    {
        $messages = $this->loadMessages();
        return $messages[$type][$category][$key] ?? $messages['error']['server']['general'];
    }

    /**
     * Generate a standardized API response with CORS headers
     * 
     * @param mixed $data The data to be included in the response
     * @param int $statusCode HTTP status code
     * @return JsonResponse
     * 
     * @example response(['data' => $user], 200)
     */
    protected function response($data, int $statusCode = 200): JsonResponse
    {
        return response()->json($data, $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    }

    /**
     * Generate a standardized error response
     * 
     * @param string $category Error category (e.g., 'validation', 'auth')
     * @param string $key Specific error key
     * @param array $errors Additional error details
     * @param int $statusCode HTTP status code
     * @return JsonResponse
     * 
     * @example errorResponse('validation', 'required', ['name' => 'Name is required'], 422)
     */
    protected function errorResponse(string $category = 'server', string $key = 'general', array $errors = [], int $statusCode = Response::HTTP_BAD_REQUEST): JsonResponse
    {
        return $this->response([
            'status' => 'error',
            'message' => $this->getMessage('error', $category, $key),
            'errors' => $errors
        ], $statusCode);
    }

    /**
     * Generate a standardized success response
     * 
     * @param mixed $data The data to be included in the response
     * @param string $key Success message key
     * @param int $statusCode HTTP status code
     * @return JsonResponse
     * 
     * @example successResponse($user, 'created', 201)
     */
    protected function successResponse($data = [], string $key = 'processed', int $statusCode = Response::HTTP_OK): JsonResponse
    {
        return $this->response([
            'status' => 'success',
            'message' => $this->getMessage('success', $key),
            'data' => $data
        ], $statusCode);
    }

    /**
     * Handle validation exceptions with detailed error messages
     * 
     * @param ValidationException $e The validation exception
     * @return JsonResponse
     */
    protected function handleValidationException(ValidationException $e): JsonResponse
    {
        return $this->errorResponse('validation', 'general', $e->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Handle and log general exceptions
     * 
     * @param Exception $e The exception to handle
     * @return JsonResponse
     */
    protected function handleException(Exception $e): JsonResponse
    {
        Log::error($e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        return $this->errorResponse('server', 'general', [], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Validate request data against given rules
     * 
     * @param Request $request The request to validate
     * @param array $rules Validation rules
     * @param array $messages Custom error messages
     * @return array Validated data
     * @throws ValidationException
     * 
     * @example validateRequest($request, ['name' => 'required|string'])
     */
    protected function validateRequest(Request $request, array $rules, array $messages = []): array
    {
        try {
            return $request->validate($rules, $messages);
        } catch (ValidationException $e) {
            throw $e;
        }
    }

    /**
     * Handle pagination parameters with support for both page-based and offset-based pagination
     * 
     * @param Request $request The request containing pagination parameters
     * @param int $defaultLength Default number of items per page
     * @return array Pagination parameters
     * @throws ValidationException
     * 
     * @example
     * $pagination = handlePagination($request, 15);
     * $query->paginate($pagination['per_page'], ['*'], 'page', $pagination['page']);
     */
    protected function handlePagination(Request $request, int $defaultLength = 10): array
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', $defaultLength);
        $start = (int) $request->query('start', ($page - 1) * $perPage);
        $length = (int) $request->query('length', $perPage);

        if ($start < 0 || $length <= 0) {
            throw ValidationException::withMessages([
                'pagination' => [$this->getMessage('error', 'pagination', 'invalid_parameters')]
            ]);
        }

        return [
            'start' => $start,
            'length' => $length,
            'page' => $page,
            'per_page' => $perPage
        ];
    }

    /**
     * Handle sorting parameters with validation
     * 
     * @param Request $request The request containing sort parameters
     * @param array $allowedFields Fields that can be used for sorting
     * @param string $defaultField Default field to sort by
     * @param string $defaultDirection Default sort direction
     * @return array [field, direction]
     * @throws ValidationException
     * 
     * @example
     * [$field, $direction] = handleSorting($request, ['name', 'created_at']);
     * $query->orderBy($field, $direction);
     */
    protected function handleSorting(Request $request, array $allowedFields, string $defaultField = 'created_at', string $defaultDirection = 'desc'): array
    {
        $field = $request->query('sort_by', $defaultField);
        $direction = strtolower($request->query('sort_direction', $defaultDirection));

        if (!in_array($field, $allowedFields)) {
            throw ValidationException::withMessages([
                'sort_by' => [$this->getMessage('error', 'sorting', 'invalid_field')]
            ]);
        }

        if (!in_array($direction, ['asc', 'desc'])) {
            throw ValidationException::withMessages([
                'sort_direction' => [$this->getMessage('error', 'sorting', 'invalid_direction')]
            ]);
        }

        return [$field, $direction];
    }

    /**
     * Handle date range parameters with validation
     * 
     * @param Request $request The request containing date range parameters
     * @param string $startField Name of the start date field
     * @param string $endField Name of the end date field
     * @return array [Carbon|null startDate, Carbon|null endDate]
     * @throws ValidationException
     * 
     * @example
     * [$startDate, $endDate] = handleDateRange($request);
     * $query->whereBetween('created_at', [$startDate, $endDate]);
     */
    protected function handleDateRange(Request $request, string $startField = 'start_date', string $endField = 'end_date'): array
    {
        $startDate = $request->query($startField) ? Carbon::parse($request->query($startField)) : null;
        $endDate = $request->query($endField) ? Carbon::parse($request->query($endField)) : null;

        if ($startDate && $endDate && $startDate->gt($endDate)) {
            throw ValidationException::withMessages([
                'date_range' => [$this->getMessage('error', 'date', 'invalid_range')]
            ]);
        }

        return [$startDate, $endDate];
    }

    /**
     * Format a date string using Carbon
     * 
     * @param string|null $date Date string to format
     * @param string $format Desired date format
     * @return string|null Formatted date or null if input is null
     * 
     * @example formatDate('2023-01-01', 'Y-m-d H:i:s')
     */
    protected function formatDate(?string $date, string $format = 'Y-m-d H:i:s'): ?string
    {
        return $date ? Carbon::parse($date)->format($format) : null;
    }

    /**
     * Handle search parameters and generate search conditions
     * 
     * @param Request $request The request containing search parameters
     * @param array $searchableFields Fields that can be searched
     * @return array Array of search conditions for query building
     * 
     * @example
     * $conditions = handleSearch($request, ['name', 'email']);
     * foreach ($conditions as $condition) {
     *     $query->orWhere($condition[0], $condition[1], $condition[2]);
     * }
     */
    protected function handleSearch(Request $request, array $searchableFields): array
    {
        $search = $request->query('search');
        if (!$search) {
            return [];
        }

        $conditions = [];
        foreach ($searchableFields as $field) {
            $conditions[] = [$field, 'LIKE', "%{$search}%"];
        }

        return $conditions;
    }

    /**
     * Handle model not found errors
     */
    protected function notFoundResponse(string $key = 'resource'): JsonResponse
    {
        return $this->errorResponse('not_found', $key, [], Response::HTTP_NOT_FOUND);
    }

    /**
     * Handle authorization errors
     */
    protected function unauthorizedResponse(string $key = 'unauthorized'): JsonResponse
    {
        return $this->errorResponse('auth', $key, [], Response::HTTP_FORBIDDEN);
    }

    /**
     * Handle authentication errors
     */
    protected function unauthenticatedResponse(): JsonResponse
    {
        return $this->errorResponse('auth', 'unauthenticated', [], Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Handle database errors
     */
    protected function databaseErrorResponse(Exception $exception): JsonResponse
    {
        return $this->errorResponse('server', 'database', [], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Handle too many requests error
     */
    protected function tooManyRequestsResponse(): JsonResponse
    {
        return $this->errorResponse('server', 'maintenance', [], Response::HTTP_TOO_MANY_REQUESTS);
    }

    /**
     * Handle method not allowed error
     */
    protected function methodNotAllowedResponse(): JsonResponse
    {
        return $this->errorResponse('request', 'invalid_method', [], Response::HTTP_METHOD_NOT_ALLOWED);
    }

    /**
     * Handle bad request error
     */
    protected function badRequestResponse(string $message = 'Bad Request'): JsonResponse
    {
        return $this->errorResponse('request', 'invalid_format', ['request' => $message], Response::HTTP_BAD_REQUEST);
    }
    public function checkIfEncrypted($value)
{
    try {
        $decrypted = Crypt::decryptString($value);
        return [
            'is_encrypted' => true,
            'value' => $decrypted
        ];
    } catch (DecryptException $e) {
        return [
            'is_encrypted' => false,
            'value' => $value
        ];
    }
}

}
