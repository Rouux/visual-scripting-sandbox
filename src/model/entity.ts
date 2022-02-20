export default abstract class Entity {
  private static _nextId = 0;

  public readonly id: number;

  public constructor() {
    this.id = Entity._nextId++;
  }
}
