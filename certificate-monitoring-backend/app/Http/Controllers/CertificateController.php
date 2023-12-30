<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class CertificateController extends Controller
{
    public function getCertificate(Request $request)
    {
        $domain = $request->input('domain');
        $url = "https://crt.sh/?q={$domain}&output=json";

        $client = new Client();
        $response = $client->get($url);

        return response()->json(json_decode($response->getBody()));
    }
    
}