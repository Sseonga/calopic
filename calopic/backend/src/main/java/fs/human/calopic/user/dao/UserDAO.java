// src/main/java/fs/human/calopic/user/dao/UserDAO.java
package fs.human.calopic.user.dao;

import fs.human.calopic.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserDAO {
    int existsByUserName(@Param("userName") String userName); // 0 or 1
    UserVO findByUserName(@Param("userName") String userName);
    int insertUser(UserVO user); // TRIGGER로 PK 자동 세팅
}
