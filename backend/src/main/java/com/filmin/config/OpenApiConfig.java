package com.filmin.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI filminOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Filmin API - Talent Meets Cinema")
                .description("REST API for Filmin: connecting film professionals with casting and crew opportunities.")
                .version("1.0.0"));
    }
}
