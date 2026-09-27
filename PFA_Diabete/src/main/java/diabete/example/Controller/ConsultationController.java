package diabete.example.Controller;

import diabete.example.entities.*;
import diabete.example.entities.Recommandation.Type;
import diabete.example.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ConsultationController {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final RiskRepository riskRepo;
    private final RecommandationRepository recRepo;
    private final PredictionRepository predictionRepository;
    @Autowired private AlertRepository alerteRepo;
    
    @Autowired private FlaskClientService flaskService;
    List<Recommandation> conseils = new ArrayList<>();
    List<Alert> alertes=new ArrayList<>();

    public ConsultationController(ConsultationRepository consultationRepository, PatientRepository patientRepository , RiskRepository riskRepo,RecommandationRepository recRepo, PredictionRepository predictionRepository) {
        this.consultationRepository = consultationRepository;
		this.patientRepository = patientRepository;
		this.riskRepo=riskRepo;
		this.recRepo = recRepo;
		this.predictionRepository = predictionRepository;
		
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        Optional<Consultation> c = consultationRepository.findById(id);
        if (c.isPresent()) return ResponseEntity.ok(c.get());
        else return ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    @PostMapping("/consultations/{patientId}")
    public Consultation createCons(@PathVariable("patientId") Long patientId,
                                   @RequestBody Consultation c) {
        Patient p = patientRepository.findById(patientId).orElseThrow();
        c.setPatient(p);
        c.setDateConsultation(LocalDate.now());
        
        boolean isFirst = !consultationRepository.existsByPatientId(patientId);
        
        c = consultationRepository.save(c);
        // Construire l’input Flask à partir de la consultation
        Map<String, Object> flaskInput = new HashMap<>();
        flaskInput.put("age", p.getAge());
        flaskInput.put("gender", p.getSexe());
        flaskInput.put("bmi", c.getImc());
        flaskInput.put("hypertension", c.isTension());
        flaskInput.put("heart_disease", c.isHeartDisease());
        flaskInput.put("smoking_history", c.getTabac());
        flaskInput.put("HbA1c_level", c.getHba1c());
        flaskInput.put("blood_glucose_level", c.getGlycemieAJeun());

        Map<String, Object> result = flaskService.sendToFlask(flaskInput);

        Map<String, Object> risks = (Map<String, Object>) result.get("risks");
        
        if (risks == null) {
        	
            throw new RuntimeException("❌ Flask n'a pas renvoyé 'risks' dans la réponse: " + result);
        }

        Risk risk = riskRepo.findByPatientId(p.getId()).orElse(new Risk());
        risk.setPatient(p);
        risk.setDateCalculee(LocalDateTime.now());
        risk.setCardiovasculaire(((Number) risks.getOrDefault("cardiac_complication", 0)).doubleValue());
        risk.setNephropathie(((Number) risks.getOrDefault("nephropathy", 0)).doubleValue());
        risk.setNeuropathie(((Number) risks.getOrDefault("neuropathy", 0)).doubleValue());
        risk.setRetinopathie(((Number) risks.getOrDefault("retinopathy", 0)).doubleValue());

        riskRepo.save(risk);
        
        if (risk.getCardiovasculaire() ==0) {
            Recommandation rec = new Recommandation();
            rec.setPatient(p);
            rec.setDateRecommandation(LocalDateTime.now());
            rec.setType(Type.SPORT); // ou Type.DIETE selon le conseil
            rec.setTitre("Risque cardiovasculaire normale");
            rec.setContenu("Votre risque cardiovasculaire est normale. Respectez une activité physique régulière et surveillez votre alimentation.");
            conseils.add(rec);
        }else {
            Alert alerte = new Alert();
            alerte.setPatient(p);
            alerte.setCategorie("Risque cardiovasculaire détecté");
            alerte.setMessage("⚠️ Risque cardiovasculaire du patient " + p.getNom() + " est détecté." );
            alerte.setDateAlerte(LocalDateTime.now());
            alerte.setNiveau(Alert.Niveau.DANGER);
            alerte.setResolue(false);
            alerte.setConseilMedecin("");
            alerteRepo.save(alerte);
        }

        if (risk.getNephropathie()==0) {
            Recommandation rec = new Recommandation();
            rec.setPatient(p);
            rec.setDateRecommandation(LocalDateTime.now());
            rec.setType(Type.DIETE);
            rec.setTitre("Risque de néphropathie");
            rec.setContenu("Votre risque de néphropathie est normale. Limitez le sel et hydratez-vous correctement.");
            conseils.add(rec);
        }else {
            Alert alerte = new Alert();
            alerte.setPatient(p);
            alerte.setCategorie("Risque de néphropathie détecté");
            alerte.setMessage("⚠️ Risque de neuropathie du patient " + p.getNom() + " est détecté.");
            alerte.setDateAlerte(LocalDateTime.now());
            alerte.setNiveau(Alert.Niveau.DANGER);
            alerte.setResolue(false);
            alerte.setConseilMedecin("");
            alerteRepo.save(alerte);
        }

        if (risk.getNeuropathie() ==0) {
            Recommandation rec = new Recommandation();
            rec.setPatient(p);
            rec.setDateRecommandation(LocalDateTime.now());
            rec.setType(Type.SPORT);
            rec.setTitre("Risque de neuropathie");
            rec.setContenu("Risque de neuropathie normale. Surveillez vos pieds et pratiquez une activité physique régulière.");
            conseils.add(rec);
        }else {
            Alert alerte = new Alert();
            alerte.setPatient(p);
            alerte.setCategorie("Risque de neuropathie détecté");
            alerte.setMessage("⚠️ Risque de neuropathie du patient " + p.getNom() + " est détecté.");
            alerte.setDateAlerte(LocalDateTime.now());
            alerte.setNiveau(Alert.Niveau.DANGER);
            alerte.setResolue(false);
            alerte.setConseilMedecin("");
            alerteRepo.save(alerte);
        }

        if (risk.getRetinopathie() ==0) {
            Recommandation rec = new Recommandation();
            rec.setPatient(p);
            rec.setDateRecommandation(LocalDateTime.now());
            rec.setType(Type.DIETE);
            rec.setTitre("Risque de rétinopathie");
            rec.setContenu("Risque de rétinopathie normale. Consultez un ophtalmologiste et surveillez votre glycémie.");
            conseils.add(rec);
        }
        else {
            Alert alerte = new Alert();
            alerte.setPatient(p);
            alerte.setCategorie("Risque de rétinopathie détecté");
            alerte.setMessage("⚠️ Risque de rétinopathie du patient " + p.getNom() + " est détecté.");
            alerte.setDateAlerte(LocalDateTime.now());
            alerte.setNiveau(Alert.Niveau.DANGER);
            alerte.setResolue(false);
            alerte.setConseilMedecin("");
            alerteRepo.save(alerte);
        }

       
        if (isFirst) {
            Prediction prediction = new Prediction();
            prediction.setPatient(p);
            prediction.setDatePrediction(LocalDateTime.now());

            prediction.setEstDiabetique((Boolean) result.getOrDefault("diabetic", false));
            prediction.setProbabilite(((Number) result.getOrDefault("probabilite", 0)).doubleValue());
            Object typeValue = result.getOrDefault("type", "Inconnu");
            prediction.setTypeDiabete(String.valueOf(typeValue));
            prediction.setConsultation(c);

            predictionRepository.save(prediction);
            if (!prediction.getEstDiabetique() && (
                    risk.getCardiovasculaire() > 0.5 ||
                    risk.getNephropathie() > 0.5 ||
                    risk.getNeuropathie() > 0.5 ||
                    risk.getRetinopathie() > 0.5)) {

                Recommandation rec = new Recommandation();
                rec.setPatient(p);
                rec.setDateRecommandation(LocalDateTime.now());
                rec.setType(Type.DIETE);
                rec.setTitre("Conseils préventifs");
                rec.setContenu("✅ Vous n'êtes pas diabétique, mais certains risques sont présents. Maintenez une alimentation équilibrée, faites de l'exercice régulièrement et surveillez votre glycémie.");
                conseils.add(rec);
            }
        }
        
         // HbA1c
            double hba1c = c.getHba1c();
            if (hba1c < 7) {
            	Recommandation recHbA1c = new Recommandation();
                recHbA1c.setPatient(p);
                recHbA1c.setDateRecommandation(LocalDateTime.now());
                recHbA1c.setType(Type.DIETE);
                recHbA1c.setTitre("HbA1c");
                recHbA1c.setContenu("HbA1c normal 👍 continuez vos bonnes habitudes.");
                conseils.add(recHbA1c);
            } else {
                // Crée l'alerte pour le médecin
                Alert alerte = new Alert();
                alerte.setPatient(p);
                alerte.setCategorie("HbA1c élevée");
                alerte.setMessage("🚨 HbA1c du patient " + p.getNom() + " est trop élevée : " + c.getHba1c());
                alerte.setDateAlerte(LocalDateTime.now());
                alerte.setNiveau(Alert.Niveau.DANGER);
                alerte.setResolue(false);
                alerte.setConseilMedecin("");
                alerteRepo.save(alerte);
            }
            // Glycémie
            if(c.getGlycemieAJeun() > 180) {
            	Alert alerte = new Alert();
                alerte.setPatient(p);
                alerte.setCategorie("Glycémie élevée");
                alerte.setMessage("🚨 Glycémie du patient " + p.getNom() + " est trop élevée : " + c.getGlycemieAJeun());
                alerte.setDateAlerte(LocalDateTime.now());
                alerte.setNiveau(Alert.Niveau.DANGER);
                alerte.setResolue(false);
                alerte.setConseilMedecin("");
                alerteRepo.save(alerte);
            }
            else {
            	Recommandation recGlycemie = new Recommandation();
                recGlycemie.setPatient(p);
                recGlycemie.setDateRecommandation(LocalDateTime.now());
                recGlycemie.setType(Type.DIETE);
                recGlycemie.setContenu("Glycémie normale : continuez votre alimentation équilibrée.");
                recGlycemie.setTitre("Glycémie");
                conseils.add(recGlycemie);
            }
            	

            // IMC / activité physique
            if(c.getImc() >= 25) {
            	Alert alerte = new Alert();
                alerte.setPatient(p);
                alerte.setCategorie("IMC élevée");
                alerte.setMessage("🚨 IMC du patient " + p.getNom() + " est trop élevée : " + c.getImc());
                alerte.setDateAlerte(LocalDateTime.now());
                alerte.setNiveau(Alert.Niveau.DANGER);
                alerte.setResolue(false);
                alerte.setConseilMedecin("");
                alerteRepo.save(alerte);
            }
            else {
                Recommandation recIMC = new Recommandation();
                recIMC.setPatient(p);
                recIMC.setDateRecommandation(LocalDateTime.now());
                recIMC.setType(Type.SPORT);
                recIMC.setContenu("IMC normal : continuez vos habitudes d'activité.");
                recIMC.setTitre("Activité physique");
                conseils.add(recIMC);
            }
            // Traitement / médication
            Recommandation recMed = new Recommandation();
            recMed.setPatient(p);
            recMed.setDateRecommandation(LocalDateTime.now());
            recMed.setType(Type.MEDIC);
            recMed.setTitre("Traitement");
            recMed.setContenu("Respectez votre traitement prescrit par le médecin.");
            conseils.add(recMed);

            recRepo.deleteByPatientId(p.getId());
            recRepo.saveAll(conseils);

        return c;
    }

    @GetMapping("/patient/{patientId}")
    public List<Consultation> getByPatient(@PathVariable Long patientId) {
        return consultationRepository.findByPatientId(patientId);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Consultation> updateConsultation(
            @PathVariable Long id,
            @RequestBody Consultation updatedConsultation) {

        Optional<Consultation> opt = consultationRepository.findById(id);
        if (!opt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Consultation existing = opt.get();
        existing.setGlycemieAJeun(updatedConsultation.getGlycemieAJeun());
        existing.setHba1c(updatedConsultation.getHba1c());
        existing.setTabac(updatedConsultation.getTabac());
        existing.setTension(updatedConsultation.isTension());
        existing.setHeartDisease(updatedConsultation.isHeartDisease());

        Consultation saved = consultationRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    // --- Delete consultation ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        if (!consultationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        consultationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

