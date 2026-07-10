package com.nihongoflow.service;

import com.nihongoflow.entity.User;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Người dùng không tồn tại."));
    }
}
