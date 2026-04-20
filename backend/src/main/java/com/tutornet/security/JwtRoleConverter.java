package com.tutornet.security;

import com.tutornet.model.Profile;
import com.tutornet.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class JwtRoleConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Autowired
    private ProfileService profileService;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());

        Profile profile = profileService.getProfileById(userId);

        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + profile.getRole())
        );

        return new JwtAuthenticationToken(jwt, authorities);
    }
}