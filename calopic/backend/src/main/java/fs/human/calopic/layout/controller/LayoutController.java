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
        Object sessionAdmin = session.getAttribute("LOGIN_IS_ADMIN");

        if (sessionName != null) {
            // 프런트가 읽는 키로 통일
            return ResponseEntity.ok(Map.of("userName", String.valueOf(sessionName),
                    "isAdmin", sessionAdmin != null ? String.valueOf(sessionAdmin) : "N"
                    ));
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

    @PostMapping("/session-refresh-admin")
    public ResponseEntity<?> refreshAdmin(HttpSession session) {
        Object idObj = session.getAttribute("LOGIN_USER_ID");
        if (idObj == null) {
            return ResponseEntity.status(401).body(Map.of("message","NO_SESSION","success",false));
        }
        Long userId = Long.valueOf(String.valueOf(idObj));
        LayoutVO vo = layoutService.getHeaderInfoByUserId(userId); // IS_ADMIN 포함 조회
        String admin = (vo != null && "Y".equalsIgnoreCase(String.valueOf(vo.getIsAdmin()).trim())) ? "Y" : "N";
        session.setAttribute("LOGIN_IS_ADMIN", admin);
        return ResponseEntity.ok(Map.of("userId", userId, "isAdmin", admin, "success", true));
    }




}
