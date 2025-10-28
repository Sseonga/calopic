package fs.human.calopic.mypage.controller;

import fs.human.calopic.mypage.service.MypageService;
import fs.human.calopic.mypage.vo.MypageVO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mypage") // ️ 기본 URL 경로 변경
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MypageController {

    private final MypageService mypageService; // ⭐️ 주입받는 Service 변경

    // 현재 로그인된 사용자의 신체 정보 조회
    @GetMapping("/userinfo") // ⭐️ 세부 경로 변경 (기존: /my)
    public ResponseEntity<?> getMyUserInfo(HttpSession session) {
        System.out.println("getMyUserInfo 호출됨. 세션 USER_ID: " + session.getAttribute("LOGIN_USER_ID"));

        Long userId = (Long) session.getAttribute("LOGIN_USER_ID");
        if (userId == null) {
            System.out.println("getMyUserInfo: 세션 ID 없음! 401 반환."); // 👈 이 부분!
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "로그인이 필요합니다."));
        }

        MypageVO userInfo = mypageService.getUserInfo(userId); // ️ 호출하는 Service 변경
        if (userInfo == null) {
            return ResponseEntity.ok(new MypageVO()); // 정보 없을 시 빈 객체 반환
        }
        return ResponseEntity.ok(userInfo);
    }

    // 현재 로그인된 사용자의 신체 정보 저장/수정
    @PutMapping("/userinfo") //  세부 경로 변경 (기존: /my)
    public ResponseEntity<Map<String, Object>> saveMyUserInfo(
            @RequestBody MypageVO userInfo,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("LOGIN_USER_ID");
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "로그인이 필요합니다."));
        }

        userInfo.setUserId(userId); // 세션 ID 사용

        try {
            mypageService.saveUserInfo(userInfo); // ️ 호출하는 Service 변경
            return ResponseEntity.ok(Map.of("success", true, "message", "신체 정보가 저장되었습니다."));
        } catch (Exception e) {
            // 간단한 예외 처리 (실제로는 로깅 등을 추가해야 함)
            System.err.println("신체 정보 저장 오류: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "저장 중 오류가 발생했습니다."));
        }
    }
}