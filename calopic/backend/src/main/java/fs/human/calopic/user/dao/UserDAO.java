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
    // 대소문자/악센트 무시 조회
    UserVO findByUserNameLinguistic(@org.apache.ibatis.annotations.Param("userName") String userName);

    // 가입 직후 USER_INFO 빈 줄 생성
    int insertUserInfoBlank(@Param("userId") Long userId);

    // 비밀번호 변경
    int updatePasswordByUserName(@Param("userName") String userName,
                                 @Param("hashedPwd") String hashedPwd);

    // 마이페이지 비밀번호 변경 및 탈퇴
    UserVO findUserById(@Param("userId") Long userId);
    int updatePasswordById(@Param("userId") Long userId, @Param("hashedPwd") String hashedPwd);
    int deleteUserById(@Param("userId") Long userId);
}
