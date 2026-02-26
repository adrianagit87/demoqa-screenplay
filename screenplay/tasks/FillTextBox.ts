import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { Type } from '../interactions/Type';

interface TextBoxData {
  fullName?: string;
  email?: string;
  currentAddress?: string;
  permanentAddress?: string;
}

export class FillTextBox implements Task {
  private constructor(private readonly data: TextBoxData) {}

  static with(data: TextBoxData): FillTextBox {
    return new FillTextBox(data);
  }

  async performAs(actor: Actor): Promise<void> {
    if (this.data.fullName !== undefined) {
      await actor.attemptsTo(Type.into('#userName', this.data.fullName));
    }
    if (this.data.email !== undefined) {
      await actor.attemptsTo(Type.into('#userEmail', this.data.email));
    }
    if (this.data.currentAddress !== undefined) {
      await actor.attemptsTo(Type.into('#currentAddress', this.data.currentAddress));
    }
    if (this.data.permanentAddress !== undefined) {
      await actor.attemptsTo(Type.into('#permanentAddress', this.data.permanentAddress));
    }
  }
}
