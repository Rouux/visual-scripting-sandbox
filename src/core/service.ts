export type Class<T> = new (...args: never[]) => T;

export default abstract class Service {
  static services = new Map<string, unknown>();

  static provide<T extends Service>(instance: T): T {
    Service.services.set(instance.constructor.name, instance);
    return instance;
  }

  static retrieve<T extends Service>(clazz: Class<T>): T {
    return Service.services.get(clazz.name) as T;
  }
}
