// src/main/java/fs/human/calopic/admin/dao/AdminDAO.java
package fs.human.calopic.admin.dao;

import fs.human.calopic.admin.vo.AdminVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminDAO {
    // role: all | admin | user
    List<AdminVO> selectUsers(@Param("role") String role);

    int deleteUsers(@Param("userIds") List<Long> userIds);

    // 테스트용: 강제 MyBatis 로딩 확인
    default void checkMapperLoaded() {
        System.out.println("✅ AdminDAO proxy loaded");
    }

    // --- 음식 클래스 ---
    List<AdminVO> selectClasses();
    int insertClass(AdminVO vo);
    int deleteClasses(@Param("classIds") List<Long> classIds);

    List<String> selectFoodNames();

    // FOOD_ID 자동 채번용 (시퀀스 대신)
    Long selectNextFoodId();

}
