package diabete.example.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity @Table(name="patients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Patient {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;

 @Column(nullable=false) private String nom;
 @Column(nullable=false) private String prenom;
 @Column(name = "date_naissance", nullable = false)
 @JsonFormat(pattern = "yyyy-MM-dd")
 private LocalDate dateNaissance;

 @Column(nullable=false) private String sexe;
 @OneToOne
 @JoinColumn(name = "user_id")
 @JsonIgnore
 private User user;
 
 @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
 private List<Consultation> consultations = new ArrayList<>();
 
 public User getUser() {
	return user;
}
public void setUser(User user) {
	this.user = user;
}
public int getAge() {
     if (dateNaissance == null) {
         return 0; // ou lever une exception
     }
     return Period.between(dateNaissance, LocalDate.now()).getYears();
 }
public Long getId() {
	return id;
}
public String getNom() {
	return nom;
}
public void setNom(String nom) {
	this.nom = nom;
}
public String getPrenom() {
	return prenom;
}
public void setPrenom(String prenom) {
	this.prenom = prenom;
}
public LocalDate getDateNaissance() {
	return dateNaissance;
}
public void setDateNaissance(LocalDate dateNaissance) {
	this.dateNaissance = dateNaissance;
}
public String getSexe() {
	return sexe;
}
public void setSexe(String sexe) {
	this.sexe = sexe;
}
public List<Consultation> getConsultations() {
	return consultations;
}
public void setConsultations(List<Consultation> consultations) {
	this.consultations = consultations;
} 
}

