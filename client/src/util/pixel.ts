export class Pixel {
  public color = "";
  public brashSize = "";
  public eraseCheck = false;
  public colorHistory = [""];

  constructor() {
    this.color = "#000000";
    this.brashSize = "5";
    this.eraseCheck = false;
    this.colorHistory = ["#000000"];
  }
}