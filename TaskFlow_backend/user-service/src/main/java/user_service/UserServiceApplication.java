package com.taskflow.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.jdbc.DataSourceBuilder;
import javax.sql.DataSource;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class UserServiceApplication {

	public static void main(String[] args) {
		System.setProperty("spring.datasource.url", "jdbc:postgresql://localhost:5432/userdb");
		System.setProperty("spring.datasource.username", "postgres");
		System.setProperty("spring.datasource.password", "postgres");
		System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
		System.setProperty("spring.jpa.hibernate.ddl-auto", "update");
		System.setProperty("eureka.client.register-with-eureka", "true");
		System.setProperty("eureka.client.service-url.defaultZone", "http://localhost:8761/eureka");
		System.setProperty("spring.rabbitmq.host", "localhost");
		System.setProperty("spring.rabbitmq.port", "5672");
		System.setProperty("spring.rabbitmq.username", "guest");
		System.setProperty("spring.rabbitmq.password", "guest");
		System.setProperty("server.port", "8082");
		SpringApplication.run(UserServiceApplication.class, args);
	}
}