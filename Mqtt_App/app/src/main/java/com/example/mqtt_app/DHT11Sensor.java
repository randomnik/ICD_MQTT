package com.example.mqtt_app;

import com.android.volley.Response;
import com.android.volley.toolbox.StringRequest;
import java.util.HashMap;
import java.util.Map;

public class DHT11Sensor extends StringRequest{
    final static private String URL = "http://192.168.35.33:3000/devices/device";  // http:// 추가
    private Map<String, String> parameters;

    public DHT11Sensor(String sensor, Response.Listener<String> listener){
        super(Method.POST, URL, listener,null);
        parameters = new HashMap<>();
        parameters.put("sensor", sensor);
    }

    @Override
    protected Map<String, String> getParams(){
        return parameters;
    }
}