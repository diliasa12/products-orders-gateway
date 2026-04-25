<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
    ];

    public function report(Throwable $exception): void
    {
        parent::report($exception);
    }

    public function render($request, Throwable $exception): JsonResponse
    {
        // Route / model not found
        if ($exception instanceof NotFoundHttpException || $exception instanceof ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Resource tidak ditemukan',
            ], 404);
        }

        // Validation errors
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $exception->errors(),
            ], 422);
        }

        // Authorization
        if ($exception instanceof AuthorizationException) {
            return response()->json([
                'success' => false,
                'message' => 'Akses tidak diizinkan',
            ], 403);
        }

        // HTTP exceptions
        if ($exception instanceof HttpException) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage() ?: 'HTTP Error',
            ], $exception->getStatusCode());
        }

        // Generic server error
        return response()->json([
            'success' => false,
            'message' => env('APP_DEBUG') ? $exception->getMessage() : 'Terjadi kesalahan pada server',
        ], 500);
    }
}
