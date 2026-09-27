package diabete.example.Controller;

import diabete.example.entities.Consultation;
import diabete.example.entities.Patient;
import diabete.example.entities.Recommandation;
import diabete.example.repositories.ConsultationRepository;
import diabete.example.repositories.PatientRepository;
import diabete.example.repositories.RecommandationRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/conseils")
@CrossOrigin(origins = "http://localhost:4200")
public class RecommandationController {

    private final PatientRepository patientRepo;
    private final ConsultationRepository consultationRepo;
    private final RecommandationRepository recRepo;

    public RecommandationController(PatientRepository patientRepo, ConsultationRepository consultationRepo,RecommandationRepository recRepo ) {
        this.patientRepo = patientRepo;
        this.consultationRepo = consultationRepo;
        this.recRepo= recRepo;
    }
    
    @GetMapping("/{patientId}")
    public List<Recommandation> getDerniersConseils(@PathVariable Long patientId) {
        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        return recRepo.findByPatientOrderByDateRecommandationDesc(patient);
    }


}
