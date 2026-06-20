package com.nihongoflow.service;

import com.nihongoflow.entity.User;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Người dùng không tồn tại."));
    }
}
