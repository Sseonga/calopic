package fs.human.calopic.record.mapper;

import fs.human.calopic.diet.dto.FoodDto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper // 인터페이스 위에 위치해야 합니다.
public interface FoodMapper { // class 대신 interface 사용

    /**
     * 음식이름 (FOOD_NAME)을 기준으로 TB_FOOD 테이블에서 검색합니다.
     * @param query 검색할 음식의 키워드
     * @return 검색된 FoodDto 리스트
     */
    List<FoodDto> searchFoodsByName(String query);
}