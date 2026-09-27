package diabete.example.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="readings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Reading {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(optional=false) @JoinColumn(name="patient_id")
 private Patient patient;

 @Column(nullable=false) private LocalDateTime datePrise;
 private Double glycAvantPetitDejeuner;
 private Double glycApresPetitDejeuner;
 private Double glycAvantDejeuner;
 private Double glycApresDejeuner;
 private Double glycAvantDiner;
 private Double glycApresDiner;
public Long getId() {
	return id;
}
public Patient getPatient() {
	return patient;
}
public void setPatient(Patient patient) {
	this.patient = patient;
}
public LocalDateTime getDatePrise() {
	return datePrise;
}
public void setDatePrise(LocalDateTime datePrise) {
	this.datePrise = datePrise;
}
public Double getGlycAvantPetitDejeuner() {
	return glycAvantPetitDejeuner;
}
public void setGlycAvantPetitDejeuner(Double glycAvantPetitDejeuner) {
	this.glycAvantPetitDejeuner = glycAvantPetitDejeuner;
}
public Double getGlycApresPetitDejeuner() {
	return glycApresPetitDejeuner;
}
public void setGlycApresPetitDejeuner(Double glycApresPetitDejeuner) {
	this.glycApresPetitDejeuner = glycApresPetitDejeuner;
}
public Double getGlycAvantDejeuner() {
	return glycAvantDejeuner;
}
public void setGlycAvantDejeuner(Double glycAvantDejeuner) {
	this.glycAvantDejeuner = glycAvantDejeuner;
}
public Double getGlycApresDejeuner() {
	return glycApresDejeuner;
}
public void setGlycApresDejeuner(Double glycApresDejeuner) {
	this.glycApresDejeuner = glycApresDejeuner;
}
public Double getGlycAvantDiner() {
	return glycAvantDiner;
}
public void setGlycAvantDiner(Double glycAvantDiner) {
	this.glycAvantDiner = glycAvantDiner;
}
public Double getGlycApresDiner() {
	return glycApresDiner;
}
public void setGlycApresDiner(Double glycApresDiner) {
	this.glycApresDiner = glycApresDiner;
}

}

