package diabete.example.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import diabete.example.entities.Consultation;
import diabete.example.entities.Patient;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
	List<Consultation> findByPatientId(Long patientId);
	boolean existsByPatientId(Long patientId);
	List<Consultation> findByPatientOrderByDateConsultationDesc(Patient patient);
}

