package fs.human.calopic.mypage.mapper;

import fs.human.calopic.mypage.vo.MypageVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MypageMapper {

    /**
     * 특정 사용자의 신체 정보를 조회합니다.
     * @param userId TB_USER.USER_ID
     * @return MypageVO 객체 (정보가 없으면 null)
     */
    MypageVO findMypageByUserId(@Param("userId") Long userId);

    /**
     * 사용자의 신체 정보를 저장하거나 수정합니다. (UPSERT)
     * @param userInfo 저장/수정할 정보 (userId 필드가 반드시 포함되어야 함)
     * @return 영향을 받은 행의 수 (1이면 성공)
     */
    int upsertMypage(MypageVO userInfo);

    int deleteUserInfoByUserId(@Param("userId") Long userId);
}