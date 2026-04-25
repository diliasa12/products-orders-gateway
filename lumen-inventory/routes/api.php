<?php


/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/', function () use ($router) {
    return response()->json([
        'service'  => 'Lumen Inventory Service',
        'version'  => $router->app->version(),
        'status'   => 'running',
    ]);
});

$router->group(['prefix' => 'api/v1'], function () use ($router) {


    $router->get('products', 'ProductController@index');

    $router->get('products/{id}', 'ProductController@show');

    $router->post('products', 'ProductController@store');

    $router->put('products/{id}', 'ProductController@update');

    $router->delete('products/{id}', 'ProductController@destroy');
});
