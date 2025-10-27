package fs.human.calopic.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "아이디는 필수입니다.")
        String userId,

        @NotBlank(message = "새 비밀번호는 필수입니다.")
        @Size(min = 8, max = 24, message = "비밀번호는 8~24자로 입력해 주세요.")
        String newPwd
) {}
