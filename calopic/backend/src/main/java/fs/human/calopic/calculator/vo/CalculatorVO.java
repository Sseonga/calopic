package fs.human.calopic.calculator.vo;

import lombok.Data;
import java.math.BigDecimal; // ️ 소수점 정밀도를 위해 BigDecimal 사용

@Data // Lombok: Getter, Setter 등을 자동으로 만들어줍니다.
public class CalculatorVO {
    private Long foodId;        // TB_FOOD의 FOOD_ID (React key로 사용)
    private String foodName;    // TB_FOOD의 FOOD_NAME
    private BigDecimal foodKcal;    // TB_FOOD의 FOOD_KCAL (NUMBER(7,2)와 매칭)
    private BigDecimal foodCarbo;
    private BigDecimal foodProtein;
    private BigDecimal foodFat;
}