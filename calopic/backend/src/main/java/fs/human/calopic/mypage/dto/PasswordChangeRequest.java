package fs.human.calopic.mypage.dto;

import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String currentPassword; // 현재 비밀번호
    private String newPassword;     // 새 비밀번호
}