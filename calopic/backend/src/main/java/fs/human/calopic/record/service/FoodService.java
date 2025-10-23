package fs.human.calopic.record.service;

import fs.human.calopic.diet.vo.FoodVO; //
import fs.human.calopic.record.dao.FoodDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // 스프링 빈으로 등록
public class FoodService {

    private final FoodDao foodDao;

    // 의존성 주입 (Mapper 주입)
    @Autowired
    public FoodService(FoodDao foodDao) {
        this.foodDao = foodDao;
    }

    /**
     * 검색어를 받아 DB에서 음식을 조회하는 로직
     * @param query 클라이언트가 입력한 검색어
     * @return 검색된 음식 목록
     */
    public List<FoodVO> searchFoods(String query) {
        // 검색어 유효성 검사
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        // Mapper를 통해 DB 조회 실행
        return foodDao.searchFoodsByName(query.trim());
    }
}