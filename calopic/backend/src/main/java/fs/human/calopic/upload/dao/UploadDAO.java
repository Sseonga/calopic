package fs.human.calopic.upload.dao;

import fs.human.calopic.upload.vo.UploadVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface UploadDAO {
    List<UploadVO> selectAllFood();
    UploadVO selectFoodByName(String foodName);
}
