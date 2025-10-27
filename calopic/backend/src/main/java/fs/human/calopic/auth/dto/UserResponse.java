package fs.human.calopic.auth.dto;

import fs.human.calopic.user.vo.UserVO;
import java.util.Date;

public record UserResponse(
        Long id,
        String userId,      // = USER_NAME
        String isAdmin,     // "Y"/"N"
        String question,    // USER_QUESTION
        Date createdDate
) {
    public static UserResponse from(UserVO v) {
        return new UserResponse(
                v.getId(),
                v.getUserName(),
                v.getIsAdmin(),
                v.getUserQuestion(),
                v.getCreatedDate()
        );
    }
}
