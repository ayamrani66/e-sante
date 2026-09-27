package diabete.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import diabete.example.entities.Alert;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
	List<Alert> findByPatientId(Long patientId);
    List<Alert> findByResolueFalse();
}
