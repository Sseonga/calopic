package fs.human.calopic.layout.service;

import fs.human.calopic.layout.dao.LayoutDAO;
import fs.human.calopic.layout.vo.LayoutVO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LayoutServiceImpl implements LayoutService {

    private final LayoutDAO layoutDAO;

    @Override
    public LayoutVO getHeaderInfo(HttpSession session) {
        if (session == null) return null;

        // 1) 세션에 이름이 이미 있으면 즉시 반환
        Object nameObj = session.getAttribute("LOGIN_USER_NAME");
        Object adminObj = session.getAttribute("LOGIN_IS_ADMIN"); // 선택: 로그인 시 넣어뒀다면
        if (nameObj != null) {
            LayoutVO vo = new LayoutVO();
            vo.setUserName(String.valueOf(nameObj));
            vo.setIsAdmin(adminObj != null ? String.valueOf(adminObj) : null);

            Object idObj = session.getAttribute("LOGIN_USER_ID");
            if (idObj != null) {
                try { vo.setUserId(Long.valueOf(String.valueOf(idObj))); }
                catch (NumberFormatException ignore) {}
            }
            log.debug("[LayoutServiceImpl] session hit userName={}", vo.getUserName());
            return vo;
        }

        // 2) 세션에 이름이 없으면, 세션의 ID로 DB 조회 → 성공 시 세션에 캐시
        Object idObj = session.getAttribute("LOGIN_USER_ID");
        if (idObj == null) {
            log.warn("[LayoutServiceImpl] 세션에 LOGIN_USER_ID가 없습니다");
            return null;
        }

        Long userId;
        try {
            userId = Long.valueOf(String.valueOf(idObj));
        } catch (NumberFormatException e) {
            log.error("[LayoutServiceImpl] LOGIN_USER_ID 파싱 실패 value={}", idObj, e);
            return null;
        }

        LayoutVO vo = layoutDAO.selectUserNameById(userId);
        if (vo == null || vo.getUserName() == null) {
            log.warn("[LayoutServiceImpl] DB 조회 결과 없음 userId={}", userId);
            return null;
        }

        // 3) 캐시: 다음 요청부터는 DB 없이 세션에서 바로 응답
        session.setAttribute("LOGIN_USER_NAME", vo.getUserName());
        session.setAttribute("LOGIN_IS_ADMIN", vo.getIsAdmin()); // 'Y'/'N'
        // 필요 시 하위 호환 키도 캐시해두면 프런트/다른 코드가 섞여 있어도 안전
        session.setAttribute("userName", vo.getUserName());
        session.setAttribute("userId", userId);

        log.debug("[LayoutServiceImpl] DB hit userId={} userName={}", userId, vo.getUserName());
        return vo;
    }

    @Override
    public LayoutVO getHeaderInfoByUserId(Long userId) {
        if (userId == null) return null;
        try {
            return layoutDAO.selectUserNameById(userId);
        } catch (Exception e) {
            log.error("[LayoutServiceImpl] getHeaderInfoByUserId 예외 userId={}", userId, e);
            return null;
        }
    }
}
