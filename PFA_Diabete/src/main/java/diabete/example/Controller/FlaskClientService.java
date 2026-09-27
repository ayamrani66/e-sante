package diabete.example.Controller;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
@Service
public class FlaskClientService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> sendToFlask(Map<String, Object> inputData) {
        String url = "http://127.0.0.1:5000/predict";
        try {
            return restTemplate.postForObject(url, inputData, Map.class);
        } catch (Exception e) {
            System.err.println("❌ Erreur Flask: " + e.getMessage());
            throw new RuntimeException("Erreur communication Flask", e);
        }
    }
}

