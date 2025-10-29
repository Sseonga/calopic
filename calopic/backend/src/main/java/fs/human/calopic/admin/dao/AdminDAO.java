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
}
