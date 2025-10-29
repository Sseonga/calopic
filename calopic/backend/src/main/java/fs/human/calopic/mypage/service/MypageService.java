package fs.human.calopic.mypage.service;

import fs.human.calopic.mypage.vo.MypageVO;

public interface MypageService {
    MypageVO getUserInfo(Long userId);
    void saveUserInfo(MypageVO userInfo);

    //  비밀번호 변경 메소드 추가
    void changePassword(Long userId, String currentPassword, String newPassword);

    // ️ 회원 탈퇴 메소드 추가
    void withdrawAccount(Long userId);
}