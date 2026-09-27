package diabete.example.Controller;

import diabete.example.entities.*;
import diabete.example.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
@RestController
@RequestMapping("/api/alertes")
@CrossOrigin(origins = "http://localhost:4200")
public class AlertController {

    @Autowired private AlertRepository alerteRepo;
    @Autowired private RecommandationRepository recRepo;
    @Autowired private PatientRepository patientRepo;

    // Créer une alerte pour un patient
    @PostMapping("/create/{patientId}")
    public Alert createAlerte(@PathVariable Long patientId, @RequestBody Alert alerte) {
        Patient p = patientRepo.findById(patientId).orElseThrow();
        alerte.setPatient(p);
        alerte.setDateAlerte(LocalDateTime.now());
        alerte.setResolue(false);
        return alerteRepo.save(alerte);
    }

    // Médecin : voir toutes les alertes non résolues
    @GetMapping("/nonresolues")
    public List<Alert> getNonResolues() {
        return alerteRepo.findByResolueFalse();
    }

    // Médecin répond à une alerte → crée une recommandation
    @PostMapping("/{alerteId}/repondre")
    public ResponseEntity<?> repondreAlerte(
            @PathVariable Long alerteId,
            @RequestBody String conseil) {

        Alert alerte = alerteRepo.findById(alerteId).orElseThrow();
        alerte.setResolue(true);
        alerte.setConseilMedecin(conseil); // sauvegarde conseil
        alerteRepo.save(alerte);

        return ResponseEntity.ok("Conseil enregistré et envoyé au patient ✅");
    }

    // Patient : voir ses alertes
    @GetMapping("/patient/{patientId}")
    public List<Alert> getByPatient(@PathVariable Long patientId) {
        return alerteRepo.findByPatientId(patientId);
    }
}
