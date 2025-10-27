// src/main/java/fs/human/calopic/user/dao/UserDAO.java
package fs.human.calopic.user.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import fs.human.calopic.user.vo.UserVO;

@Mapper
public interface UserDAO {
    int existsByUserName(@Param("userName") String userName);
    UserVO findByUserName(@Param("userName") String userName);
    void insertUser(UserVO user);

    // ★ 추가: 비밀번호 변경
    int updatePasswordByUserName(@Param("userName") String userName,
                                 @Param("hashedPwd") String hashedPwd);
}
