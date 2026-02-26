import type { Ability } from './Ability';
import type { Interaction } from './Interaction';
import type { Task } from './Task';
import type { Question } from './Question';

export class Actor {
  constructor(
    private readonly name: string,
    private readonly abilities: Map<Function, Ability> = new Map()
  ) {}

  static named(name: string): Actor {
    return new Actor(name);
  }

  whoCan(...abilities: Ability[]): Actor {
    const map = new Map<Function, Ability>(this.abilities);
    for (const ability of abilities) {
      map.set(ability.constructor, ability);
    }
    return new Actor(this.name, map);
  }

  abilityTo<T extends Ability>(abilityClass: new (...args: any[]) => T): T {
    const ability = this.abilities.get(abilityClass);
    if (!ability) {
      throw new Error(`${this.name} does not have the ability ${abilityClass.name}`);
    }
    return ability as T;
  }

  async attemptsTo(...actions: (Interaction | Task)[]): Promise<void> {
    for (const action of actions) {
      await action.performAs(this);
    }
  }

  async asks<T>(question: Question<T>): Promise<T> {
    return question.answeredBy(this);
  }

  toString(): string {
    return this.name;
  }
}
