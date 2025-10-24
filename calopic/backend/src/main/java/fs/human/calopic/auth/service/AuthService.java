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
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

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
        // DB 트리거로 USER_ID가 부여됨. 조회가 필요하면 아래 한 줄로 재조회 가능:
        // user = userMapper.findByUserName(userName);
        user.setUserPassword(null);
        return user;
    }

    public UserVO login(String userName, String rawPwd) {
        UserVO found = userDAO.findByUserName(userName);
        if (found == null) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        if (!encoder.matches(rawPwd, found.getUserPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        found.setUserPassword(null);
        return found;
    }
}
