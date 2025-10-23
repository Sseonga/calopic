fs.human.calopic.conpig.WebConfig.java

package fs.human.calopic.conpig;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Spring 설정 파일임을 명시
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") //  모든 API 경로에 대해 CORS 허용
                // 프론트엔드(React)가 실행되는 주소 허용
                .allowedOrigins("http://localhost:3000")
                // GET, POST, PUT, DELETE 등 모든 주요 메서드 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true) // 인증 정보(쿠키 등) 전송 허용
                .maxAge(3600); // CORS Pre-flight 요청 결과를 1시간 동안 캐시
    }
}