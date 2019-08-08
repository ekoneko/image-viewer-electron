export abstract class LifeCycle {
  public abstract ready(): void

  public abstract activate(): void

  public abstract focus(): void

  public abstract beforeQuit(): void

  public abstract secondInstance(): void
}
