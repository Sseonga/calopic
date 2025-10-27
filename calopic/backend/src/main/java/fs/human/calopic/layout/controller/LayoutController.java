package fs.human.calopic.layout.controller;

import fs.human.calopic.layout.service.LayoutService;
import fs.human.calopic.layout.vo.LayoutVO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/layout")
@RequiredArgsConstructor
public class LayoutController {

    private final LayoutService layoutService;

    @GetMapping("/header")
    public ResponseEntity<LayoutVO> getHeader(HttpSession session) {
        LayoutVO vo = layoutService.getHeaderInfo(session);
        if (vo == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(vo);
    }
}
