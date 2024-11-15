package com.example.mqtt_app;

import android.os.Bundle;
import android.os.Handler;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.Volley;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private WebView cameraView; // 카메라 뷰를 위한 WebView
    private TextView tempTextView;
    private TextView humidityTextView;
    private TextView createdAtTextView;
    private Spinner spinner;
    private ListView listView;
    private ArrayAdapter<String> adapter;
    private List<String> sensorDataList;
    private Handler handler = new Handler();

    private Runnable dataUpdater = new Runnable() {
        @Override
        public void run() {
            getSensorData(); // 데이터를 주기적으로 가져옴
            handler.postDelayed(this, 2000); // 갱신 주기를 2초로 조정
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // WebView 초기화 및 설정
        cameraView = findViewById(R.id.camera_view);
        WebSettings webSettings = cameraView.getSettings();
        webSettings.setJavaScriptEnabled(true); // JavaScript 활성화
        cameraView.setWebViewClient(new WebViewClient()); // 웹페이지 로드 시 외부 브라우저로 열리지 않도록 설정
        cameraView.loadUrl("http://****/stream"); // ESP32 카메라 스트리밍 URL 설정, ESP32 리셋 후 시리얼 모니터 IP 확인

        // UI 요소 초기화
        tempTextView = findViewById(R.id.temp);
        humidityTextView = findViewById(R.id.humidity);
        createdAtTextView = findViewById(R.id.created_at);
        spinner = findViewById(R.id.spinner);
        listView = findViewById(R.id.listview);

        // 리스트뷰 데이터 초기화 및 어댑터 설정
        sensorDataList = new ArrayList<>();
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, sensorDataList);
        listView.setAdapter(adapter);

        // 스피너 초기화 (예시 센서 목록 설정)
        initializeSpinner();

        // 데이터 갱신 시작
        handler.post(dataUpdater);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        handler.removeCallbacks(dataUpdater);
    }

    private void getSensorData() {
        // 서버로부터 데이터를 요청하는 Response.Listener 설정
        Response.Listener<String> responseListener = new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray jsonArray = new JSONArray(response);

                    // 최신 데이터로 UI 업데이트
                    if (jsonArray.length() > 0) {
                        sensorDataList.clear(); // 리스트뷰를 비우고 최신 데이터로 갱신
                        for (int i = 0; i < jsonArray.length(); i++) {
                            JSONObject sensorData = jsonArray.getJSONObject(i);
                            String temperature = sensorData.getString("tmp");
                            String humidity = sensorData.getString("hum");
                            String createdAt = sensorData.getString("created_at");

                            tempTextView.setText("온도: " + temperature + "°C");
                            humidityTextView.setText("습도: " + humidity + "%");
                            createdAtTextView.setText("수집 정보 (날짜/시간): " + createdAt);

                            String listItem = "온도: " + temperature + "°C, 습도: " + humidity + "%, 날짜/시간: " + createdAt;
                            sensorDataList.add(listItem);
                        }
                        adapter.notifyDataSetChanged();
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                    Toast.makeText(MainActivity.this, "데이터 파싱 오류", Toast.LENGTH_SHORT).show();
                }
            }
        };

        // DHT11Sensor 클래스의 인스턴스를 생성하여 POST 요청 전송
        DHT11Sensor dht11SensorRequest = new DHT11Sensor("dht11", responseListener);
        RequestQueue queue = Volley.newRequestQueue(MainActivity.this);
        queue.add(dht11SensorRequest);
    }

    private void initializeSpinner() {
        // 예시 센서 목록 설정
        List<String> sensorList = new ArrayList<>();
        sensorList.add("DHT11");
        sensorList.add("OtherSensor"); // 다른 센서 타입 추가 가능

        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, sensorList);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(spinnerAdapter);
    }
}