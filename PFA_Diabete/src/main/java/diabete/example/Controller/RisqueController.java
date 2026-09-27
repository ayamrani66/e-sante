package diabete.example.Controller;

import diabete.example.entities.Patient;
import diabete.example.entities.Risk;
import diabete.example.repositories.PatientRepository;
import diabete.example.repositories.RiskRepository;
import diabete.example.Controller.FlaskClientService;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/risks")
@CrossOrigin(origins = "http://localhost:4200")

public class RisqueController {

    @Autowired private RiskRepository riskRepo;

    @GetMapping("/last/{patientId}")
    public Risk getLastRisk(@PathVariable Long patientId) {
        return riskRepo.findTopByPatientIdOrderByDateCalculeeDesc(patientId)
                .orElseThrow(() -> new RuntimeException("Aucun risque trouvé pour ce patient"));
    }

}
