package fs.human.calopic.calculator.service;

import fs.human.calopic.calculator.dao.CalculatorDAO;
import fs.human.calopic.calculator.vo.CalculatorVO;
import lombok.RequiredArgsConstructor; // Lombok 사용 시
import org.springframework.stereotype.Service;
import java.util.List;

@Service // 이 클래스가 서비스 역할을 함을 명시
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 만듦 (Lombok)
public class CalculatorServiceImpl implements CalculatorService {

    private final CalculatorDAO calculatorDAO; // DAO 인터페이스 주입

    @Override
    public List<CalculatorVO> getAllFoodsForCalculator() {
        // DAO를 호출하여 DB에서 데이터를 가져와 반환
        return calculatorDAO.selectAllFoodsForCalculator();
    }
}