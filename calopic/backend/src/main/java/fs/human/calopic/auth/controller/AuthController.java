package fs.human.calopic.auth.controller;

import fs.human.calopic.auth.dto.JoinRequest;
import fs.human.calopic.auth.dto.LoginRequest;
import fs.human.calopic.auth.service.AuthService;
import fs.human.calopic.user.vo.UserVO;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth") // 프론트 axios baseURL=/, authApi.js가 /auth/* 호출
public class AuthController {

    private final AuthService authService;

    // 아이디(=USER_NAME) 중복확인
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Object>> checkId(@RequestParam String userId) {
        boolean available = !authService.existsUserName(userId);
        String message = available ? "사용 가능한 아이디입니다 :)" : "이미 사용 중인 아이디입니다.";
        return ResponseEntity.ok(Map.of(
                "success", true,
                "available", available,
                "message", message
        ));
    }

    // 회원가입: { userId, userPwd, question, answer }
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> join(@Valid @RequestBody JoinRequest req) {
        UserVO user = authService.join(req.getUserId(), req.getUserPwd(), req.getQuestion(), req.getAnswer());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "회원가입이 완료되었습니다.",
                "user", toResponse(user)
        ));
    }

    // 로그인: { userId, userPassword }
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req, HttpSession session) {
        UserVO user = authService.login(req.getUserId(), req.getUserPassword());
        // 필요 시 서버세션 사용 (withCredentials=true 대비)
        session.setAttribute("LOGIN_USER_NAME", user.getUserName());
        session.setAttribute("LOGIN_USER_ID",   user.getId()); // 숫자 PK
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그인에 성공했습니다.",
                "user", toResponse(user)
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그아웃 되었습니다."
        ));
    }

    // 프론트 호환 응답 변환 (password 제외, 이름 혼란 방지를 위해 두 키 모두 제공)
    private Map<String, Object> toResponse(UserVO u) {
        return Map.of(
                "id",       u.getId(),          // 숫자 PK (TB_USER.USER_ID)
                "userId",   u.getUserName(),    // 프론트에서 쓰는 로그인 아이디
                "isAdmin",  u.getIsAdmin(),
                "question", u.getUserQuestion(),
                "createdDate", u.getCreatedDate()
        );
    }
}
