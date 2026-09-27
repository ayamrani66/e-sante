package diabete.example.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity @Table(name="consultations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Consultation {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(optional = false, cascade = CascadeType.ALL) @JoinColumn(name="patient_id")
 @JsonIgnore
 private Patient patient;

 @Column(nullable=false) private LocalDate dateConsultation;
 @Column(name = "glycemie_a_jeun")
 private Double glycemieAJeun;
 private Double hba1c;
 @Transient private double poids;  // pas stocké en base
 @Transient private double taille; // pas stocké en base
 private Double imc;
 private Boolean tension;
 private String tabac;
 private Boolean heartDisease;
 @OneToOne(mappedBy = "consultation", cascade = CascadeType.ALL, orphanRemoval = true)
 @JsonIgnore
 private Prediction prediction;
 
public Long getId() {
	return id;
}
public LocalDate getDateConsultation() {
	return dateConsultation;
}
public void setDateConsultation(LocalDate dateConsultation) {
	this.dateConsultation = dateConsultation;
}
public Double getGlycemieAJeun() {
	return glycemieAJeun;
}
public void setGlycemieAJeun(Double glycemieAJeun) {
	this.glycemieAJeun = glycemieAJeun;
}
public Double getHba1c() {
	return hba1c;
}
public void setHba1c(Double hba1c) {
	this.hba1c = hba1c;
}
public double getPoids() { return poids; }
public void setPoids(double poids) {
    this.poids = poids;
}

public double getTaille() { return taille; }
public void setTaille(double taille) {
    this.taille = taille;
}

public double getImc() { return imc; }

public void calculerIMC() {
    if (taille > 0 && poids > 0) {
        this.imc = poids / Math.pow(taille / 100.0, 2);
    }
}

public Boolean isTension() {
	return tension;
}
public void setTension(Boolean tension) {
	this.tension = tension;
}
public String getTabac() {
	return tabac;
}
public void setTabac(String tabac) {
	this.tabac = tabac;
}
public Boolean isHeartDisease() {
	return heartDisease;
}
public void setHeartDisease(Boolean heartDisease) {
	this.heartDisease = heartDisease;
}
public Patient getPatient() {
	return patient;
}
public void setPatient(Patient patient) {
	this.patient = patient;
}
public Prediction getPrediction() {
	return prediction;
}
public void setPrediction(Prediction prediction) {
	this.prediction = prediction;
}

 
}

