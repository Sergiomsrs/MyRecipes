package org.mendez.mr.myrecipesapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MyRecipesApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyRecipesApiApplication.class, args);
    }

}
