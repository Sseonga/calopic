package fs.human.calopic.mypage.service;

import fs.human.calopic.mypage.vo.MypageVO;

public interface MypageService {
    MypageVO getUserInfo(Long userId);
    void saveUserInfo(MypageVO userInfo);
}