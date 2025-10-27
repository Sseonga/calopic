package fs.human.calopic.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginRequest {
    @NotBlank private String userId;        // = USER_NAME
    @NotBlank private String userPassword;  // 원문 비밀번호
}