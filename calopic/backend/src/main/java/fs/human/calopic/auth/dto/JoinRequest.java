package fs.human.calopic.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JoinRequest(
        @NotBlank(message = "아이디는 필수입니다.")
        @Size(min = 4, max = 32, message = "아이디는 4~32자로 입력해 주세요.")
        String userId,

        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 8, max = 64, message = "비밀번호는 8~64자로 입력해 주세요.")
        String userPwd,

        @NotBlank(message = "보안질문은 필수입니다.")
        String question,

        @NotBlank(message = "보안답변은 필수입니다.")
        String answer
) {}
