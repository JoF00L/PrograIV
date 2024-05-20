package org.billingii;

import org.billingii.service.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@SpringBootApplication
public class BillingIiApplication {

	public static void main(String[] args) {
		SpringApplication.run(BillingIiApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer(){
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				//WebMvcConfigurer.super.addCorsMappings(registry);
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:3000")
						.allowedMethods("GET", "POST", "PUT", "DELETE")
						.allowCredentials(true);
			}
		};
	}

	@Bean("securityFilterChain")
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		var chain = http
				.authorizeHttpRequests(customizer -> customizer
						.requestMatchers("/api/login/login").permitAll()
						.requestMatchers("/api/login/logout").authenticated()
						.requestMatchers(HttpMethod.POST,"/api/**").hasAnyAuthority("ADM", "PRO")
						.requestMatchers("/api/**").hasAnyAuthority("ADM","PRO")
						.requestMatchers("/**").permitAll()
				)
				.exceptionHandling(customizer -> customizer
						.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
				.csrf().disable()
                .build();
		return chain;
	}
}
