package diabete.example;

import diabete.example.entities.Consultation;
import diabete.example.entities.Patient;
import diabete.example.entities.User;
import diabete.example.entities.User.Role;
import diabete.example.repositories.UserRepository;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Override
    public void run(String... args) {
        // Créer un patient
        
        
    }
}

