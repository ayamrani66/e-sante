package diabete.example.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import diabete.example.entities.Prediction;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
	List<Prediction> findByPatientId(Long patientId);
	Optional<Prediction> findTopByPatientIdOrderByDatePredictionDesc(Long patientId);
}

