export class Pixel {
  public tool = ""; // 도구
  public color = ""; // 색상 
  public brashSize = ""; // 크기
  public colorHistory = [""]; // 색상 기록
  public location= ""; // 위치
  public userName= ""; // 작성자

  constructor() {
    this.tool = "move";
    this.color = "#000000";
    this.brashSize = "5";
    this.colorHistory = ["#000000"];
  }
}