package fs.human.calopic.calculator.dao;

import fs.human.calopic.calculator.vo.CalculatorVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper // MyBatis Mapper 인터페이스임을 명시
public interface CalculatorDAO {
    // TB_FOOD 테이블에서 모든 음식의 ID, 이름, 칼로리를 가져오는 메소드 선언
    List<CalculatorVO> selectAllFoodsForCalculator();
}