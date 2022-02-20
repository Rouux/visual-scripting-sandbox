export type Class<T> = new (...args: never[]) => T;

export default abstract class Service {
  public static services = new Map<string, unknown>();

  public static provide<T extends Service>(instance: T): T {
    Service.services.set(instance.constructor.name, instance);
    return instance;
  }

  public static retrieve<T extends Service>(clazz: Class<T>): T {
    return Service.services.get(clazz.name) as T;
  }
}
