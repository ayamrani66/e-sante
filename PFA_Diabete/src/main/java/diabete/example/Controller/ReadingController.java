package diabete.example.Controller;

import diabete.example.entities.Patient;
import diabete.example.entities.Reading;
import diabete.example.repositories.PatientRepository;
import diabete.example.repositories.ReadingRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "http://localhost:4200")
public class ReadingController {

    private final ReadingRepository readingRepo;
    private final PatientRepository patientRepo;

    public ReadingController(ReadingRepository readingRepo, PatientRepository patientRepo) {
        this.readingRepo = readingRepo;
        this.patientRepo = patientRepo;
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<Reading> addReading(@PathVariable Long patientId, @RequestBody Reading reading) {
        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        reading.setPatient(patient);
        reading.setDatePrise(LocalDateTime.now());

        Reading saved = readingRepo.save(reading);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{patientId}")
    public List<Reading> getReadings(@PathVariable Long patientId) {
        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        return readingRepo.findByPatientOrderByDatePriseDesc(patient);
    }

}
