// src/main/java/fs/human/calopic/admin/service/AdminService.java
package fs.human.calopic.admin.service;

import fs.human.calopic.admin.vo.AdminVO;
import java.util.List;

public interface AdminService {
    List<AdminVO> getUsers(String role); // role: all|admin|user

    int deleteUsers(List<Long> userIds);

    // AdminService.java
    void checkMapperLoaded();

    // 음식 클래스
    List<AdminVO> getClasses();
    int addClass(AdminVO vo);
    int deleteClasses(List<Long> classIds);

    List<String> getFoodNames();


}
