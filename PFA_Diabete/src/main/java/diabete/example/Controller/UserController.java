package diabete.example.Controller;

import diabete.example.entities.Patient;
import diabete.example.entities.User;
import diabete.example.entities.User.Role;
import diabete.example.repositories.UserRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body("Utilisateur non trouvé");
        }

        User user = optionalUser.get();
        if (!user.getMotdepasse().equals(request.getMotdepasse())) {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }

        // Construire la réponse personnalisée
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        if (user.getRole() == Role.PATIENT && user.getPatient() != null) {
            response.put("patientId", user.getPatient().getId());
        }

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setMotdepasse(request.getMotdepasse());
        user.setRole(Role.PATIENT);
        
        Patient patient = new Patient();
        patient.setNom(request.getPatient().getNom());
        patient.setPrenom(request.getPatient().getPrenom());
        patient.setSexe(request.getPatient().getSexe());
        patient.setDateNaissance(request.getPatient().getDateNaissance());
     
        patient.setUser(user);
        user.setPatient(patient);

        userRepository.save(user);

        return ResponseEntity.ok(patient);
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow();

        user.setEmail(userDetails.getEmail());

        if (userDetails.getMotdepasse() != null && !userDetails.getMotdepasse().isEmpty()) {
            user.setMotdepasse(userDetails.getMotdepasse()); // ⚠️ à hasher normalement
        }

        return ResponseEntity.ok(userRepository.save(user));
    }
}


