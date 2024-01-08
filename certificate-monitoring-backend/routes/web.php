<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\SubscriptionController;


Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);

Route::group(['middleware' => 'cors'], function () {
  Route::get('/get-certificate', [CertificateController::class, 'getCertificate']);
});
