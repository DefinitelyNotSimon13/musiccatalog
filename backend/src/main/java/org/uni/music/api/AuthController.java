package org.uni.music.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {

    @GetMapping("/user")
    public Map<String, Object> getUser(@AuthenticationPrincipal OidcUser user) {
        if (user == null) {
            throw new AuthenticationServiceException("No authenticated OIDC user");
        }

        return Map.of(
                "type", "oidc",
                "sub", user.getSubject(),
                "username", user.getPreferredUsername(),
                "email", user.getEmail(),
                "claims", user.getClaims()
        );
    }

    @GetMapping("/jwt")
    public Map<String, Object> getUserFromJwt(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            throw new AuthenticationServiceException("No JWT available for current request");
        }

        return Map.of(
                "type", "jwt",
                "sub", jwt.getSubject(),
                "username", jwt.getClaimAsString("preferred_username"),
                "email", jwt.getClaimAsString("email"),
                "claims", jwt.getClaims()
        );
    }
}
