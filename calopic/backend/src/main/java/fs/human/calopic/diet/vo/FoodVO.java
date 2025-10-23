package fs.human.calopic.diet.vo;

import lombok.Data;

@Data //  @Data 어노테이션 추가 (Getter, Setter 등을 자동으로 생성)
public class FoodVO {
    private String foodCode;
    private String foodName;
    private double foodKcal; // double 타입인 경우 (DB 스키마에 따라 Integer일 수도 있음)
}