package org.uni.music.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.uni.music.util.JwtConverter;
//import org.uni.music.security.JwtConverter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@AllArgsConstructor
public class SecurityConfig {
    private final JwtConverter jwtConverter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        // allow swagger if you want
                        .requestMatchers("/docs/**", "/v3/api-docs/**", "/api/v1/tracks/**", "/api/v1/artists/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(
                        (oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter)))
                )
                .oauth2Login(Customizer.withDefaults())
                .oauth2Client(Customizer.withDefaults())
                .logout(logout -> {
                    var logoutSuccessHandler =
                            new OidcClientInitiatedLogoutSuccessHandler(clientRegistrationRepository);
                    logoutSuccessHandler.setPostLogoutRedirectUri("{baseUrl}/");
                    logout.logoutSuccessHandler(logoutSuccessHandler);
                });
        ;
        return http.build();
    }
}
