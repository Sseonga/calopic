package fs.human.calopic.layout.controller;

import fs.human.calopic.layout.service.LayoutService;
import fs.human.calopic.layout.vo.LayoutVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/layout")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LayoutController {

    private final LayoutService layoutService;

    @GetMapping("/header")
    public ResponseEntity<?> getHeader(HttpSession session) {
        Object sessionName = session.getAttribute("LOGIN_USER_NAME");
        if (sessionName != null) {
            // 프런트가 읽는 키로 통일
            return ResponseEntity.ok(Map.of("userName", String.valueOf(sessionName)));
        }
        // 이름이 없을 때만 id로 DB 조회(옵션)
        Object sessionId = session.getAttribute("LOGIN_USER_ID");
        if (sessionId != null) {
            try {
                Long userId = Long.valueOf(String.valueOf(sessionId));
                LayoutVO vo = layoutService.getHeaderInfoByUserId(userId);
                if (vo != null && vo.getUserName() != null) {
                    return ResponseEntity.ok(Map.of("userName", vo.getUserName()));
                }
            } catch (NumberFormatException ignore) {}
        }
        return ResponseEntity.status(404).body(Map.of("message", "USER_NOT_FOUND"));
    }


}
