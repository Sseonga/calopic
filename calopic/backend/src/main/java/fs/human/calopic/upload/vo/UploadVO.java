package fs.human.calopic.upload.vo;

import lombok.Data;

@Data
public class UploadVO {
    private int foodId;
    private String foodName;
    private double foodWeight;
    private double foodKcal;
    private double foodCarbo;
    private double foodProtein;
    private double foodFat;
    private double foodSugar;
    private double foodNatrium;
}
