package fs.human.calopic.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyQARequest(
        @NotBlank(message = "아이디는 필수입니다.") String userId,
        @NotBlank(message = "질문은 필수입니다.") String question,
        @NotBlank(message = "답변은 필수입니다.") String answer
) {}
