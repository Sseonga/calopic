// src/main/java/fs/human/calopic/auth/dto/JoinRequest.java
package fs.human.calopic.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class JoinRequest {
    @NotBlank private String userId;   // = USER_NAME
    @NotBlank private String userPwd;  // 원문 비밀번호
    @NotBlank private String question; // = USER_QUESTION (코드값)
    @NotBlank private String answer;   // = USER_ANSWER
}