package diabete.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import diabete.example.entities.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
}

