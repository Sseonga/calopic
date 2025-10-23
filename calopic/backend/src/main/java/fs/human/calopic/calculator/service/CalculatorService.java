package fs.human.calopic.calculator.service;

import fs.human.calopic.calculator.vo.CalculatorVO;
import java.util.List;

public interface CalculatorService {
    // 음식 목록 전체를 조회하는 서비스 메소드 선언
    List<CalculatorVO> getAllFoodsForCalculator();
}