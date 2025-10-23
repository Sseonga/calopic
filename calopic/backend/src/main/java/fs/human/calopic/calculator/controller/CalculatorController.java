package fs.human.calopic.calculator.controller;

import fs.human.calopic.calculator.service.CalculatorService;
import fs.human.calopic.calculator.vo.CalculatorVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController // REST API 컨트롤러임을 명시
@RequestMapping("/api/calculator") // 이 컨트롤러의 기본 URL 경로
@RequiredArgsConstructor // Service 주입을 위한 생성자 자동 생성
@CrossOrigin(origins = "http://localhost:3000") // React 개발 서버(포트 3000) 요청 허용
public class CalculatorController {

    private final CalculatorService calculatorService;

    // GET 요청 '/api/calculator/foods' 를 처리하는 메소드
    @GetMapping("/foods")
    public List<CalculatorVO> getAllFoods() {
        // Service를 호출하여 음식 목록 데이터를 가져와 반환
        return calculatorService.getAllFoodsForCalculator();
    }
}