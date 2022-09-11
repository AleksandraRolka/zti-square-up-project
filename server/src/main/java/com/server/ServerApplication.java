package com.server;

import com.server.models.User;
import com.server.models.Role;
import com.server.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	PropertiesUtils propertiesUtils() { return new PropertiesUtils(); }

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CommandLineRunner runner(UserService userService) {
		return args -> {
			userService.saveRole(new Role(null, "ROLE_USER"));
			userService.saveRole(new Role(null, "ROLE_ADMIN"));


			userService.saveUser(new User(null, "John", "Travolta", "johntravowlta@gmail.com", "pass123", new ArrayList<>()));
			userService.saveUser(new User(null, "Will", "Smith", "willsmith@gmail.com", "pass123", new ArrayList<>()));
			userService.saveUser(new User(null, "Jim", "Carry", "jimcarry@gmail.com", "pass123", new ArrayList<>()));
			userService.saveUser(new User(null, "Arnold", "Schwarzenegger", "arnoldschwarzenegger@gmail.com", "pass123", new ArrayList<>()));

			userService.addRoleToUser("johntravowlta@gmail.com","ROLE_USER");
			userService.addRoleToUser("johntravowlta@gmail.com","ROLE_USER");
			userService.addRoleToUser("jimcarry@gmail.com","ROLE_USER");
			userService.addRoleToUser("arnoldschwarzenegger@gmail.com","ROLE_USER");
		};
	}
}
