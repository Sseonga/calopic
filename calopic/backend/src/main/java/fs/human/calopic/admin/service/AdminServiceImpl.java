// src/main/java/fs/human/calopic/admin/service/AdminServiceImpl.java
package fs.human.calopic.admin.service;

import fs.human.calopic.admin.dao.AdminDAO;
import fs.human.calopic.admin.vo.AdminVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
