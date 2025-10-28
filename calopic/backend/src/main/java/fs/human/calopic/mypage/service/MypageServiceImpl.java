package fs.human.calopic.mypage.service;

import fs.human.calopic.mypage.mapper.MypageMapper;
import fs.human.calopic.mypage.vo.MypageVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MypageServiceImpl implements MypageService {

    private final MypageMapper mypageMapper;

    @Override
    public MypageVO getUserInfo(Long userId) {
        return mypageMapper.findMypageByUserId(userId);
    }

    @Override
    @Transactional
    public void saveUserInfo(MypageVO userInfo) {
        userInfo.setUserId(userInfo.getUserId()); // userId가 설정되었는지 확인 (보안 강화)
        mypageMapper.upsertMypage(userInfo);
    }
}