package com.parth.splitit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@ComponentScan(basePackages = { "com.parth.splitit" })
public class SplitItApplication {

	public static void main(String[] args) {
		SpringApplication.run(SplitItApplication.class, args);
	}

	@Configuration
	public class WebConfig implements WebMvcConfigurer {

		@SuppressWarnings("null")
		@Override
		public void addCorsMappings(CorsRegistry registry) {
			registry.addMapping("/api/**") // Define the mapping pattern
					.allowedOrigins("http://localhost:3000") // Allow requests from this origin
					.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
					.allowedHeaders("Content-Type", "Authorization")
					.allowCredentials(true); // Allow credentials (cookies, authorization headers)
		}
	}

}
