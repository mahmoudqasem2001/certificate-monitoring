<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'domain' => 'required',
            'email' => 'required|email',
        ]);

        Subscription::create([
            'domain' => $request->input('domain'),
            'email' => $request->input('email'),
        ]);

        return response()->json(['message' => 'Subscription successful']);
    }
}