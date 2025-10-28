package fs.human.calopic.layout.service;

import fs.human.calopic.layout.vo.LayoutVO;
import jakarta.servlet.http.HttpSession;

public interface LayoutService {
    LayoutVO getHeaderInfo(HttpSession session);
}
