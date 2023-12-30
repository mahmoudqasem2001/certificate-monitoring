<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CertificateController;

Route::group(['middleware' => 'cors'], function () {
  Route::get('/get-certificate', [CertificateController::class, 'getCertificate']);
});
