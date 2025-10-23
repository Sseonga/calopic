package fs.human.calopic.record.controller;


import fs.human.calopic.diet.dto.FoodDto;
import fs.human.calopic.record.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/foods") // 클라이언트에서 호출할 기본 URL
public class FoodController {

    private final FoodService foodService;

    // FoodService를 의존성 주입합니다.
    @Autowired
    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    /**
     * 음식 검색 API 엔드포인트
     * 요청 URL: GET /api/foods/search?query=검색어
     */
    @GetMapping("/search")
    public ResponseEntity<List<FoodDto>> searchFoods(
            // 클라이언트가 전송한 'query' 파라미터를 받습니다.
            @RequestParam(name = "query") String query) {

        // Service 호출
        List<FoodDto> foods = foodService.searchFoods(query);

        // 검색된 목록을 HTTP 200 OK와 함께 JSON으로 반환합니다.
        return ResponseEntity.ok(foods);
    }
}