package fs.human.calopic.upload.vo;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UploadVO {
//    private int foodId;
//    private String foodName;
//    private String foodWeight;
//    private double foodKcal;
//    private double foodCarbo;
//    private double foodProtein;
//    private double foodFat;
//    private double foodSugar;
//    private double foodNatrium;
//
//    private Integer foodWeightGram; //foodWeight 숫자만 파싱

    private Long foodId;
    private String foodName;
    private String foodWeight;          // 원본 "100g"
    private Integer foodWeightGram;     // 숫자만 파싱해서 담을 곳

    private BigDecimal foodKcal;
    private BigDecimal foodCarbo;
    private BigDecimal foodProtein;
    private BigDecimal foodFat;
    private BigDecimal foodSugar;
    private BigDecimal foodNatrium;

    private String yoloId;

    private String userId;       // PK 혹은 로그인 식별자
    private String userGender;   // 'gender01' | 'gender02'
}
