package diabete.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import diabete.example.entities.Patient;
import diabete.example.entities.Reading;

@Repository
public interface ReadingRepository extends JpaRepository<Reading, Long> {
	 List<Reading> findByPatientOrderByDatePriseDesc(Patient patient);
}
