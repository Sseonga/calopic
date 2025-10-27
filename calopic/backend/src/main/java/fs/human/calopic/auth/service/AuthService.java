// src/main/java/fs/human/calopic/auth/service/AuthService.java
package fs.human.calopic.auth.service;

import fs.human.calopic.user.dao.UserDAO;
import fs.human.calopic.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserDAO userDAO;
    private final BCryptPasswordEncoder encoder; // ← Bean 주입으로 변경 권장

    public boolean existsUserName(String userName) {
        return userDAO.existsByUserName(userName) > 0;
    }

    @Transactional
    public UserVO join(String userName, String rawPwd, String question, String answer) {
        if (existsUserName(userName)) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        UserVO user = UserVO.builder()
                .userName(userName)
                .userPassword(encoder.encode(rawPwd))
                .isAdmin("N")
                .userQuestion(question)
                .userAnswer(answer)
                .build();

        userDAO.insertUser(user);

        UserVO saved = userDAO.findByUserName(userName);
        if (saved == null) {
            throw new IllegalStateException("회원가입 후 사용자 조회에 실패했습니다.");
        }

        // 가입과 동시에 TB_USER_INFO에 빈 레코드 생성
        userDAO.insertUserInfoBlank(saved.getId());

        saved.setUserPassword(null);
        return saved;
    }

    public UserVO login(String userName, String rawPwd) {
        UserVO found = userDAO.findByUserName(userName);
        if (found == null || !encoder.matches(rawPwd, found.getUserPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        found.setUserPassword(null);
        return found;
    }

    /** ① 보안질문/답변 검증 */
    public boolean verifyQA(String userName, String question, String answer) {
        UserVO found = userDAO.findByUserName(userName);
        if (found == null) return false;

        // 비교 정책: 질문코드/답변 모두 트림 후 대소문자 구분 없이 비교 (필요 시 변경)
        String q = found.getUserQuestion() == null ? "" : found.getUserQuestion().trim();
        String a = found.getUserAnswer()   == null ? "" : found.getUserAnswer().trim();

        String rq = question == null ? "" : question.trim();
        String ra = answer   == null ? "" : answer.trim();

        return q.equalsIgnoreCase(rq) && a.equalsIgnoreCase(ra);
    }

    /** ② 비밀번호 변경 */
    @Transactional
    public void changePassword(String userName, String newRawPwd) {
        UserVO found = userDAO.findByUserName(userName);
        if (found == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        String hashed = encoder.encode(newRawPwd);
        int updated = userDAO.updatePasswordByUserName(userName, hashed);
        if (updated != 1) {
            throw new IllegalStateException("비밀번호 변경에 실패했습니다.");
        }
    }
}
