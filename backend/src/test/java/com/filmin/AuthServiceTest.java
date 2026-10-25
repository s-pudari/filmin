package com.filmin;

import com.filmin.auth.AuthService;
import com.filmin.auth.User;
import com.filmin.auth.UserRepository;
import com.filmin.auth.dto.AuthUserResponse;
import com.filmin.auth.dto.RegisterRequest;
import com.filmin.common.DuplicateResourceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("test@filmin.demo", "password123");
    }

    @Test
    @DisplayName("T-001: Register successfully normalizes email and hashes password")
    void register_success() {
        when(userRepository.existsByEmailIgnoreCase("test@filmin.demo")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword123");
        
        User savedUser = new User("test@filmin.demo", "hashedPassword123");
        savedUser.setId(10L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthUserResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("test@filmin.demo", response.getEmail());
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("T-002: Register with existing email throws DuplicateResourceException (409)")
    void register_duplicateEmail_throwsDuplicateResourceException() {
        when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }
}
