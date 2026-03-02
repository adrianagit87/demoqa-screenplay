import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { WaitFor } from '../../screenplay/interactions/WaitFor';
import { Visibility } from '../../screenplay/questions/Visibility';
import { Text } from '../../screenplay/questions/Text';
import { ExpandTreeNode } from '../../screenplay/tasks/ExpandTreeNode';
import { CheckTreeNode } from '../../screenplay/tasks/CheckTreeNode';

test.describe('Check Box', () => {
  // DemoQA uses rc-tree — nodes expand lazily, ExpandTreeNode waits for animation to settle

  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(
      Navigate.to('/checkbox'),
      WaitFor.visibility('.rc-tree'),
    );
  });

  test('CHECK-001: expand tree, check Documents, verify result shown', async ({ actor }) => {
    await actor.attemptsTo(
      ExpandTreeNode.root(),
      CheckTreeNode.named('Documents'),
    );

    const resultVisible = await actor.asks(Visibility.of('#result'));
    expect(resultVisible).toBe(true);

    const resultText = await actor.asks(Text.of('#result'));
    expect(resultText.toLowerCase()).toContain('documents');
  });

  test('CHECK-002: check Home (root) marks everything', async ({ actor }) => {
    await actor.attemptsTo(CheckTreeNode.named('Home'));

    const resultText = await actor.asks(Text.of('#result'));
    expect(resultText.toLowerCase()).toContain('home');
    expect(resultText.toLowerCase()).toContain('documents');
    expect(resultText.toLowerCase()).toContain('desktop');
  });

  test('CHECK-003: check then uncheck restores original state', async ({ actor }) => {
    await actor.attemptsTo(CheckTreeNode.named('Home'));
    let resultVisible = await actor.asks(Visibility.of('#result'));
    expect(resultVisible).toBe(true);

    await actor.attemptsTo(CheckTreeNode.named('Home'));
    resultVisible = await actor.asks(Visibility.of('#result'));
    expect(resultVisible).toBe(false);
  });
});
