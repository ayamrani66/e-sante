package diabete.example.Controller;

import diabete.example.entities.Patient;
import diabete.example.repositories.PatientRepository;
import diabete.example.repositories.PredictionRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;
    private final PredictionRepository predictionRepo;

    public PatientController(PatientRepository patientRepository,PredictionRepository predictionRepo) {
        this.patientRepository = patientRepository;
		this.predictionRepo = predictionRepo;
    }

    @GetMapping
    public List<Map<String, Object>> getAllPatients() {
    	List<Patient> patients = patientRepository.findAll();
        
        List<Map<String, Object>> result = new ArrayList<>();

        for (Patient p : patients) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("nom", p.getNom());
            map.put("prenom", p.getPrenom());
            map.put("sexe", p.getSexe());
            map.put("dateNaissance", p.getDateNaissance());
            map.put("consultations", p.getConsultations());

            // 🔹 dernière prédiction
            predictionRepo.findTopByPatientIdOrderByDatePredictionDesc(p.getId())
                .ifPresent(pred -> map.put("prediction", pred));

            result.add(map);
        }

        return result;
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    @GetMapping("/{id}")
    public Map<String, Object> getPatient(@PathVariable Long id) {
        Patient p = patientRepository.findById(id).orElseThrow();
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("nom", p.getNom());
        map.put("prenom", p.getPrenom());
        map.put("sexe", p.getSexe());
        map.put("dateNaissance", p.getDateNaissance());
        map.put("consultations", p.getConsultations());

        // 🔹 dernière prédiction
        predictionRepo.findTopByPatientIdOrderByDatePredictionDesc(p.getId())
            .ifPresent(pred -> map.put("prediction", pred));

        return map;}
    
    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        Patient patient = patientRepository.findById(id).orElseThrow();
        patient.setNom(patientDetails.getNom());
        patient.setPrenom(patientDetails.getPrenom());
        patient.setDateNaissance(patientDetails.getDateNaissance());
        patient.setSexe(patientDetails.getSexe());
        return patientRepository.save(patient);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
        patientRepository.deleteById(id);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Déconnecté avec succès");
    }

}

