export class Pixel {
  public tool = "";
  public color = "";
  public brashSize = "";
  public colorHistory = [""];
  public scroll = true;

  constructor() {
    this.tool = "move";
    this.color = "#000000";
    this.brashSize = "5";
    this.colorHistory = ["#000000"];
    this.scroll = true;
  }
}