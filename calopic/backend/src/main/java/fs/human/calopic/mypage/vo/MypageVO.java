package fs.human.calopic.mypage.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class MypageVO {
    private Long userId;
    private String userGender;
    private BigDecimal userHeight;
    private BigDecimal userWeight;
    private BigDecimal userBodyfat;
    private BigDecimal userMuscle;
    private String userGoal;
}