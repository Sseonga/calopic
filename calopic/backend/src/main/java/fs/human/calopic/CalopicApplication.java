package fs.human.calopic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;

@SpringBootApplication(
		// 2. Component Scan 범위를 명시적으로 지정
		scanBasePackages = {
				"fs.human.calopic", // (fs.human.calopic 하위 전체를 스캔하므로, record, user 등이 포함됨)
				"fs.human.calopic.record" // ⬅️ FoodService, FoodController 등을 스캔하기 위해 추가
		}
)

@MapperScan(basePackages = "fs.human.calopic.record.mapper")
public class CalopicApplication {

	public static void main(String[] args) {
		SpringApplication.run(CalopicApplication.class, args);
	}

}