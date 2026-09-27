package diabete.example.Controller;

import diabete.example.entities.Patient;
import diabete.example.entities.Prediction;
import diabete.example.repositories.PatientRepository;
import diabete.example.repositories.PredictionRepository;
import diabete.example.Controller.FlaskClientService;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "http://localhost:4200")
public class PredictionController {

    @Autowired private PredictionRepository predictionRepo;
    @Autowired private PatientRepository patientRepo;
    @Autowired private FlaskClientService flaskService;

    @PostMapping("/predict/{patientId}")
    public Prediction predictDiabetes(@PathVariable Long patientId, @RequestBody Map<String, Object> inputData) {
        Patient patient = patientRepo.findById(patientId).orElseThrow();

        // Envoyer les données à Flask
        Map<String, Object> result = flaskService.sendToFlask(inputData);

        // Sauvegarde Prediction
        Prediction prediction = new Prediction();
        prediction.setPatient(patient);
        prediction.setDatePrediction(LocalDateTime.now());
        prediction.setEstDiabetique((Boolean) result.get("diabetic"));
        prediction.setProbabilite((Double) result.get("probability"));
        prediction.setTypeDiabete((String) result.get("type"));

        return predictionRepo.save(prediction);
    }

    @GetMapping("/history/{patientId}")
    public List<Prediction> history(@PathVariable Long patientId) {
        return predictionRepo.findByPatientId(patientId);
    }
}
