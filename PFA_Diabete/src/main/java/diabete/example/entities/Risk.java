package diabete.example.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="risques")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Risk {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(optional=false) @JoinColumn(name="patient_id")
 private Patient patient;

 @Column(nullable=false) private LocalDateTime dateCalculee;
 private Double retinopathie;
 private Double neuropathie;
 private Double cardiovasculaire;
 private Double nephropathie;
public Long getId() {
	return id;
}
public Patient getPatient() {
	return patient;
}
public void setPatient(Patient patient) {
	this.patient = patient;
}
public LocalDateTime getDateCalculee() {
	return dateCalculee;
}
public void setDateCalculee(LocalDateTime dateCalculee) {
	this.dateCalculee = dateCalculee;
}
public Double getRetinopathie() {
	return retinopathie;
}
public void setRetinopathie(Double retinopathie) {
	this.retinopathie = retinopathie;
}
public Double getNeuropathie() {
	return neuropathie;
}
public void setNeuropathie(Double neuropathie) {
	this.neuropathie = neuropathie;
}
public Double getCardiovasculaire() {
	return cardiovasculaire;
}
public void setCardiovasculaire(Double cardiovasculaire) {
	this.cardiovasculaire = cardiovasculaire;
}
public Double getNephropathie() {
	return nephropathie;
}
public void setNephropathie(Double nephropathie) {
	this.nephropathie = nephropathie;
}
 
 
}

