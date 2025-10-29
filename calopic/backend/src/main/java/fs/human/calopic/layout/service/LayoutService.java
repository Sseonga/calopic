package fs.human.calopic.layout.service;

import fs.human.calopic.layout.vo.LayoutVO;
import jakarta.servlet.http.HttpSession;

public interface LayoutService {
    LayoutVO getHeaderInfo(HttpSession session);

    // 세션 비의존: userId로만 조회 (테스트/재사용 용)
    LayoutVO getHeaderInfoByUserId(Long userId);
}
