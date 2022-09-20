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
import java.util.Collection;
import java.util.List;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CommandLineRunner runner(UserService userService) {
		return args -> {
			Role admin = new Role(null, "ROLE_ADMIN");
			Role ordUser = new Role(null, "ROLE_USER");
			userService.saveRole(admin);
			userService.saveRole(ordUser);

			userService.saveUser(new User("John", "Travolta", "johntravowlta@gmail.com", "Temp123!", List.of(new Role[]{ordUser})));
			userService.saveUser(new User("Will", "Smith", "willsmith@gmail.com", "Temp123!", List.of(new Role[]{admin})));
			userService.saveUser(new User("Jim", "Carry", "jimcarry@gmail.com", "Temp123!", new ArrayList<>()));
			userService.saveUser(new User("Arnold", "Schwarzenegger", "arnoldschwarzenegger@gmail.com", "Temp123!", List.of(new Role[]{ordUser})));
			userService.saveUser(new User("Aleksandra", "Rolka", "ar@op.pl", "Temp1!", List.of(new Role[]{ordUser})));
		};
	}
}
