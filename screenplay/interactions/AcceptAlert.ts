import type { Actor } from '../core/Actor';
import type { Interaction } from '../core/Interaction';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class AcceptAlert implements Interaction {
  private constructor(private readonly dismiss: boolean = false) {}

  static confirm(): AcceptAlert {
    return new AcceptAlert(false);
  }

  static dismiss(): AcceptAlert {
    return new AcceptAlert(true);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    if (this.dismiss) {
      page.once('dialog', dialog => dialog.dismiss());
    } else {
      page.once('dialog', dialog => dialog.accept());
    }
  }
}
