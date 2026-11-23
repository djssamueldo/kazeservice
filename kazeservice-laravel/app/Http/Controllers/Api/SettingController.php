<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::first();

        if (!$settings) {
            $settings = SiteSetting::create([
                'telephone' => '+228 92 99 97 38',
                'email' => 'kazeservices@gmail.com',
                'whatsapp' => '+228 92 99 97 38',
                'adresse' => '966 avenue AKEI, Lomé, Togo',
                'horaires' => 'Lun - Ven: 8h - 18h | Sam: 9h - 13h',
            ]);
        }

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $settings = SiteSetting::firstOrFail();
        $settings->update($request->all());
        return response()->json($settings);
    }
}
