package diabete.example.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;

 @Column(unique=true, nullable=false) private String email;
 @Column(nullable=false) private String motdepasse;

 @Enumerated(EnumType.STRING)
 @Column(nullable=false)
 private Role role;

 @OneToOne(cascade = CascadeType.ALL,orphanRemoval = true)
 @JoinColumn(name="patient_id")
 private Patient patient;

 public enum Role { MEDECIN, PATIENT }

public Long getId() {
	return id;
}

public String getEmail() {
	return email;
}

public void setEmail(String email) {
	this.email = email;
}

public String getMotdepasse() {
	return motdepasse;
}


public void setMotdepasse(String motdepasse) {
	this.motdepasse = motdepasse;
}

public Role getRole() {
	return role;
}

public void setRole(Role role) {
	this.role = role;
}

public Patient getPatient() {
	return patient;
}

public void setPatient(Patient patient) {
	this.patient = patient;
}
 
 
}
