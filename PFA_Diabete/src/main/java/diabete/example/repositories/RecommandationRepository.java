package diabete.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import diabete.example.entities.Patient;
import diabete.example.entities.Recommandation;
import jakarta.transaction.Transactional;

@Repository
public interface RecommandationRepository extends JpaRepository<Recommandation, Long>{
	 List<Recommandation> findByPatientOrderByDateRecommandationDesc(Patient patient);
	 @Modifying
	    @Transactional
	    @Query("DELETE FROM Recommandation r WHERE r.patient.id = :patientId")
	    void deleteByPatientId(@Param("patientId") Long patientId);
}
