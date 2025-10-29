// src/main/java/fs/human/calopic/admin/service/AdminServiceImpl.java
package fs.human.calopic.admin.service;

import fs.human.calopic.admin.dao.AdminDAO;
import fs.human.calopic.admin.vo.AdminVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminDAO adminDAO;

    @Override
    public List<AdminVO> getUsers(String role) {
        // 방어적으로 정상값만 허용
        String normalized = "all";
        if ("admin".equalsIgnoreCase(role)) normalized = "admin";
        else if ("user".equalsIgnoreCase(role)) normalized = "user";
        return adminDAO.selectUsers(normalized);
    }

    @Override
    @Transactional
    public int deleteUsers(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) return 0;

        // 1000개 초과 시 청크 단위로 분할
        final int LIMIT = 1000;
        int deleted = 0;
        for (int i = 0; i < userIds.size(); i += LIMIT) {
            List<Long> chunk = new ArrayList<>(
                    userIds.subList(i, Math.min(i + LIMIT, userIds.size()))
            );
            deleted += adminDAO.deleteUsers(chunk);
        }
        return deleted;
    }

    // AdminServiceImpl.java
    @Override
    public void checkMapperLoaded() {
        adminDAO.checkMapperLoaded();
    }

    // ---------- 음식 클래스 ----------
    @Override
    public List<AdminVO> getClasses() {
        return adminDAO.selectClasses();
    }

    @Override
    public int addClass(AdminVO vo) {
        // DB에서 최대 ID 조회 후 +1
        Long nextId = adminDAO.selectNextFoodId();  // mapper에 쿼리 추가 필요
        vo.setFoodId(nextId);
        return adminDAO.insertClass(vo);
    }

    @Override
    @Transactional
    public int deleteClasses(List<Long> classIds) {
        if (classIds == null || classIds.isEmpty()) return 0;
        return adminDAO.deleteClasses(classIds);
    }

    @Override
    public List<String> getFoodNames() {
        return adminDAO.selectFoodNames();
    }


}
