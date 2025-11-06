package org.uni.music.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfig {
    @Bean
    public OpenAPI api() {
        return new OpenAPI()
                .info(
                        new Info()
                                .title("Music Catalog API")
                                .description("CHANGE ME")
                                .version("1.0")
                                .contact(new Contact().name("your mon").email("your@mom.com"))
                                .license(new License().identifier("MIT"))
                );

    }
}
