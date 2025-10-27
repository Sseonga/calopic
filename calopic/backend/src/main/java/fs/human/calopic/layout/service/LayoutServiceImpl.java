// fs/human/calopic/layout/service/LayoutServiceImpl.java
package fs.human.calopic.layout.service;

import fs.human.calopic.layout.dao.LayoutDAO;
import fs.human.calopic.layout.vo.LayoutVO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LayoutServiceImpl implements LayoutService {

    private final LayoutDAO layoutDAO;

    @Override
    public LayoutVO getHeaderInfo(HttpSession session) {
        System.out.println("[SVC] getHeaderInfo 호출");

        Object idAttr = session.getAttribute("LOGIN_USER_ID");
        System.out.println("[SVC] 세션 LOGIN_USER_ID=" + idAttr);

        if (idAttr == null) return null;

        Long userId;
        try {
            userId = (idAttr instanceof Long) ? (Long) idAttr : Long.valueOf(idAttr.toString());
        } catch (Exception e) {
            System.out.println("[SVC] userId 파싱 실패: raw=" + idAttr);
            e.printStackTrace();
            return null;
        }

        try {
            System.out.println("[SVC] DAO.existsUserId 호출 uid=" + userId);
            Integer exists = layoutDAO.existsUserId(userId);
            System.out.println("[SVC] DAO.existsUserId 결과=" + exists);

            if (exists == null || exists == 0) {
                System.out.println("[SVC] tb_user에 user_id=" + userId + " 없음");
                return null;
            }

            LayoutVO vo = new LayoutVO();
            vo.setUserId(userId);
            System.out.println("[SVC] 반환 LayoutVO=" + vo);
            return vo;

        } catch (Exception e) {
            System.out.println("[SVC] DAO 호출 중 예외 발생");
            e.printStackTrace();
            return null;
        }
    }
}
