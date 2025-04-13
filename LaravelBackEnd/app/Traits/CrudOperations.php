<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Exception;

/**
 * Trait CrudOperations
 *
 * Provides common CRUD operations for controllers to reduce code duplication.
 * Controllers using this trait should define:
 * - $model: The Eloquent model class
 * - $validationRules: Array of validation rules
 */
trait CrudOperations
{
    /**
     * Get all records
     */
    public function index(): JsonResponse
    {
        try {
            $records = $this->getModelClass()::all();
            return $this->successResponse($records, 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get paginated list of records
     */
    public function paginate(Request $request): JsonResponse
    {
        try {
            $pagination = $this->handlePagination($request, 10);
            $modelClass = $this->getModelClass();

            $records = $modelClass::skip($pagination['start'])
                ->take($pagination['length'])
                ->get();

            return $this->successResponse([
                'data' => $records,
                'total' => $modelClass::count()
            ], 'retrieved');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get a specific record
     */
    public function show(int $id): JsonResponse
    {
        try {
            $record = $this->findRecord($id);
            if (!$record) {
                return $this->notFoundResponse($this->getResourceName());
            }
            return $this->successResponse($record, 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Create a new record
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $this->validateRequest($request, $this->getValidationRules());
            $record = $this->getModelClass()::create($validatedData);

            if (method_exists($this, 'afterStore')) {
                $this->afterStore($record);
            }

            return $this->successResponse($record, 'created', 201);
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update a record
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $record = $this->findRecord($id);
            if (!$record) {
                return $this->notFoundResponse($this->getResourceName());
            }

            $validatedData = $this->validateRequest($request, $this->getValidationRules());
            $record->update($validatedData);

            if (method_exists($this, 'afterUpdate')) {
                $this->afterUpdate($record);
            }

            return $this->successResponse($record, 'updated');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete a record
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $record = $this->findRecord($id);
            if (!$record) {
                return $this->notFoundResponse($this->getResourceName());
            }

            $record->delete();
            return $this->successResponse(null, 'deleted');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get records count
     */
    public function count(): JsonResponse
    {
        try {
            $count = $this->getModelClass()::count();
            return $this->successResponse(['count' => $count], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Find a record by ID, with optional relationships eager loading
     */
    protected function findRecord(int $id)
    {
        $query = $this->getModelClass()::query();

        if (method_exists($this, 'getDefaultRelationships')) {
            $query->with($this->getDefaultRelationships());
        }

        return $query->find($id);
    }

    /**
     * Get the model class to use for CRUD operations
     */
    protected function getModelClass(): string
    {
        if (!property_exists($this, 'model')) {
            throw new Exception('Model property is not defined in the controller');
        }

        return $this->model;
    }

    /**
     * Get validation rules for CRUD operations
     */
    protected function getValidationRules(): array
    {
        if (!property_exists($this, 'validationRules')) {
            throw new Exception('validationRules property is not defined in the controller');
        }

        return $this->validationRules;
    }

    /**
     * Get resource name for error messages
     */
    protected function getResourceName(): string
    {
        if (property_exists($this, 'resourceName')) {
            return $this->resourceName;
        }

        // Try to guess resource name from model class
        $modelClass = $this->getModelClass();
        $parts = explode('\\', $modelClass);
        return strtolower(end($parts));
    }
}
