package diabete.example.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="alertes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Alert {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(optional=false) @JoinColumn(name="patient_id")
 private Patient patient;

 @Column(nullable=false) private LocalDateTime dateAlerte;
 private String categorie;

 @Column(columnDefinition="TEXT")
 private String message;

 @Enumerated(EnumType.STRING)
 private Niveau niveau;
 
 @Column(columnDefinition="TEXT")
 private String conseilMedecin;

 private Boolean resolue = false;

 public enum Niveau { INFO, WARN, DANGER }

public Long getId() {
	return id;
}

public Patient getPatient() {
	return patient;
}

public void setPatient(Patient patient) {
	this.patient = patient;
}

public LocalDateTime getDateAlerte() {
	return dateAlerte;
}

public void setDateAlerte(LocalDateTime dateAlerte) {
	this.dateAlerte = dateAlerte;
}

public String getCategorie() {
	return categorie;
}

public void setCategorie(String categorie) {
	this.categorie = categorie;
}

public String getMessage() {
	return message;
}

public void setMessage(String message) {
	this.message = message;
}

public Niveau getNiveau() {
	return niveau;
}

public void setNiveau(Niveau niveau) {
	this.niveau = niveau;
}

public Boolean getResolue() {
	return resolue;
}

public void setResolue(Boolean resolue) {
	this.resolue = resolue;
}

public String getConseilMedecin() {
	return conseilMedecin;
}

public void setConseilMedecin(String conseilMedecin) {
	this.conseilMedecin = conseilMedecin;
}
 
}

