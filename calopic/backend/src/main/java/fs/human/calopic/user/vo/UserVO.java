// src/main/java/fs/human/calopic/user/vo/UserVO.java
package fs.human.calopic.user.vo;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVO {
    private Long id;               // TB_USER.USER_ID (NUMBER PK)
    private String userName;       // TB_USER.USER_NAME (로그인 아이디)
    private String userPassword;   // TB_USER.USER_PASSWORD (bcrypt 해시)
    private String isAdmin;        // TB_USER.IS_ADMIN (Y/N)
    private String userQuestion;   // TB_USER.USER_QUESTION (TB_CODE_D.CODE_DETAIL_ID)
    private String userAnswer;     // TB_USER.USER_ANSWER
    private Date createdDate;      // TB_USER.CREATED_DATE
    private Long createdId;        // TB_USER.CREATED_ID
    private Date updatedDate;      // TB_USER.UPDATED_DATE
    private Long updatedId;        // TB_USER.UPDATED_ID
}
