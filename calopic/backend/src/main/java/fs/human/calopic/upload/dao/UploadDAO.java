package fs.human.calopic.upload.dao;

import fs.human.calopic.upload.vo.UploadVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UploadDAO {
    List<UploadVO> selectAllFood();
    UploadVO selectFoodByName(String foodName);

    // 추가: YOLO_ID 리스트 조회
    List<UploadVO> selectFoodByYoloIds(@Param("yoloIds") List<String> yoloIds);

    // 추가: 현재 로그인된 유저의 성별 조회
    UploadVO selectUserGender(@Param("userId") String userId);
}
