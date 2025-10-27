package fs.human.calopic.auth.controller;

import fs.human.calopic.auth.dto.ChangePasswordRequest;
import fs.human.calopic.auth.dto.JoinRequest;
import fs.human.calopic.auth.dto.LoginRequest;
import fs.human.calopic.auth.dto.VerifyQARequest;
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

    private static final String PW_RESET_VERIFIED_USER = "PW_RESET_VERIFIED_USER";

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
        UserVO user = authService.join(req.userId(), req.userPwd(), req.question(), req.answer());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "회원가입이 완료되었습니다.",
                "user", Map.of(
                        "id", user.getId(),
                        "userId", user.getUserName(),
                        "isAdmin", user.getIsAdmin(),
                        "question", user.getUserQuestion(),
                        "createdDate", user.getCreatedDate()
                )
        ));
    }

    // 비밀번호 변경: 초기화 검증: 성공 시 세션에 인증 상태 저장
    @PostMapping("/reset-password/verify")
    public ResponseEntity<Map<String, Object>> verifyQA(
            @Valid @RequestBody VerifyQARequest req,
            HttpSession session
    ) {
        boolean ok = authService.verifyQA(req.userId(), req.question(), req.answer());

        if (!ok) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "정보가 일치하지 않습니다."
            ));
        }
        // 동일 사용자만 비번변경 가능하도록 세션에 표식 저장
        session.setAttribute(PW_RESET_VERIFIED_USER, req.userId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "본인 확인이 완료되었습니다."
        ));
    }

    // 비밀번호 변경: 세션 검증 후 변경
    @PostMapping("/reset-password/change")
    public ResponseEntity<Map<String, Object>> changePassword(
            @Valid @RequestBody ChangePasswordRequest req,
            HttpSession session
    ) {
        Object verifiedUser = session.getAttribute(PW_RESET_VERIFIED_USER);
        if (verifiedUser == null || !req.userId().equals(verifiedUser.toString())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "비밀번호 변경 권한이 없습니다. 다시 본인 확인을 해주세요."
            ));
        }

        authService.changePassword(req.userId(), req.newPwd());

        // 1회용 인증 세션 제거
        session.removeAttribute(PW_RESET_VERIFIED_USER);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "비밀번호가 변경되었습니다."
        ));
    }

    // 로그인: { userId, userPassword }
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req, HttpSession session) {
        UserVO user = authService.login(req.userId(), req.userPassword());
        session.setAttribute("LOGIN_USER_NAME", user.getUserName());
        session.setAttribute("LOGIN_USER_ID",   user.getId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그인에 성공했습니다.",
                "user", Map.of(
                        "id", user.getId(),
                        "userId", user.getUserName(),
                        "isAdmin", user.getIsAdmin(),
                        "question", user.getUserQuestion(),
                        "createdDate", user.getCreatedDate()
                )
        ));
    }

    //  로그아웃
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
