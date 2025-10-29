// fs/human/calopic/layout/dao/LayoutDAO.java
package fs.human.calopic.layout.dao;

import fs.human.calopic.layout.vo.LayoutVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface LayoutDAO {

    // Oracle: tb_user.user_id = NUMBER(PK)
    @Select("SELECT COUNT(1) FROM tb_user WHERE user_id = #{uid}")
    Integer existsUserId(@Param("uid") Long uid);

    LayoutVO selectUserNameById(@Param("userId") Long userId);
}
