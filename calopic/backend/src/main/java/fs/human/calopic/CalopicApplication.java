package fs.human.calopic;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("fs.human.calopic.**.dao")
public class CalopicApplication {

	public static void main(String[] args) {
		SpringApplication.run(CalopicApplication.class, args);
	}

}
