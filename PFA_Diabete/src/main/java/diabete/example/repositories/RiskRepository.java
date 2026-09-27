package diabete.example.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import diabete.example.entities.Patient;
import diabete.example.entities.Risk;

@Repository
public interface RiskRepository extends JpaRepository<Risk, Long> {
	List<Risk> findByPatientOrderByDateCalculeeDesc(Patient patient);
    Optional<Risk> findFirstByPatientOrderByDateCalculeeDesc(Patient patient);
    Optional<Risk> findTopByPatientIdOrderByDateCalculeeDesc(Long patientId);
    Optional<Risk> findByPatientId(Long patientId);
}
