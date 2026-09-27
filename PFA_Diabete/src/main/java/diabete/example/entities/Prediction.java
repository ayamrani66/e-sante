package diabete.example.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity @Table(name="predictions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Prediction {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) @JoinColumn(name="patient_id")
    private Patient patient;
    
    @OneToOne(optional=false, cascade = CascadeType.ALL)
    @JoinColumn(name="consultation_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Consultation consultation;

    @Column(nullable=false) private LocalDateTime datePrediction;
    private Boolean estDiabetique;
    private Double probabilite;
    private String typeDiabete; // "T1","T2"
	public Long getId() {
		return id;
	}

	public Patient getPatient() {
		return patient;
	}
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	public LocalDateTime getDatePrediction() {
		return datePrediction;
	}
	public void setDatePrediction(LocalDateTime datePrediction) {
		this.datePrediction = datePrediction;
	}
	public Boolean getEstDiabetique() {
		return estDiabetique;
	}
	public void setEstDiabetique(Boolean estDiabetique) {
		this.estDiabetique = estDiabetique;
	}
	public Double getProbabilite() {
		return probabilite;
	}
	public void setProbabilite(Double probabilite) {
		this.probabilite = probabilite;
	}
	public String getTypeDiabete() {
		return typeDiabete;
	}
	public void setTypeDiabete(String typeDiabete) {
		this.typeDiabete = typeDiabete;
	}

	public Consultation getConsultation() {
		return consultation;
	}

	public void setConsultation(Consultation consultation) {
		this.consultation = consultation;
	}
    
    
}
