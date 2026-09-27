package diabete.example.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="recommandations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Recommandation {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(optional=false) @JoinColumn(name="patient_id")
 private Patient patient;

 @Column(nullable=false) private LocalDateTime dateRecommandation;
 private String titre;

 @Column(columnDefinition="TEXT")
 private String contenu;

 @Enumerated(EnumType.STRING)
 private Type type;

 public enum Type { DIETE, SPORT, MEDIC }

public Long getId() {
	return id;
}


public Patient getPatient() {
	return patient;
}

public void setPatient(Patient patient) {
	this.patient = patient;
}

public LocalDateTime getDateRecommandation() {
	return dateRecommandation;
}

public void setDateRecommandation(LocalDateTime dateRecommandation) {
	this.dateRecommandation = dateRecommandation;
}

public String getTitre() {
	return titre;
}

public void setTitre(String titre) {
	this.titre = titre;
}

public String getContenu() {
	return contenu;
}

public void setContenu(String contenu) {
	this.contenu = contenu;
}

public Type getType() {
	return type;
}

public void setType(Type type) {
	this.type = type;
}
 
 
}

