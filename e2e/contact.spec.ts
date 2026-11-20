import { ui } from '../src/content/ui';
import { expect, test } from './fixtures';

for (const locale of ['en', 'sk'] as const) {
  const copy = ui[locale].contact;
  const path = locale === 'en' ? '/' : '/sk';

  test(`${locale}: contact validates required fields and email accessibly without submitting`, async ({
    page,
  }) => {
    let submissions = 0;
    page.on('request', (request) => {
      if (request.method() === 'POST') submissions++;
    });
    await page.goto(path);
    const form = page.locator('#contact form');
    const name = form.getByRole('textbox', { name: copy.form.name, exact: true });
    const email = form.getByRole('textbox', { name: copy.form.email, exact: true });
    const message = form.getByRole('textbox', { name: copy.form.message, exact: true });
    const submit = form.getByRole('button', { name: copy.form.send, exact: true });
    await submit.click();
    await expect(form.getByText(copy.form.required, { exact: true })).toHaveCount(3);
    for (const field of [name, email, message]) {
      await expect(field).toHaveAttribute('aria-invalid', 'true');
    }
    for (const field of [name, email]) {
      await expect(field).toHaveAccessibleDescription(copy.form.required);
    }
    await expect(message).toHaveAccessibleDescription(`${copy.form.required} 0 / 1000`);
    await expect(name).toBeFocused();
    await name.fill('A reader');
    await email.fill('invalid-address');
    await message.fill('I would like to discuss a project.');
    for (const field of [name, email, message]) {
      await expect(field).not.toHaveAttribute('aria-invalid');
    }
    await submit.click();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription(copy.form.invalidEmail);
    await email.fill('reader@example.com');
    await expect(email).not.toHaveAttribute('aria-describedby');
    expect(submissions).toBe(0);
    await expect(page).not.toHaveURL(/senderName|senderEmail|message=/);
  });

  test(`${locale}: message counter and input limits match the form constraints`, async ({
    page,
  }) => {
    await page.goto(path);
    const form = page.locator('#contact form');
    const name = form.getByRole('textbox', { name: copy.form.name, exact: true });
    const email = form.getByRole('textbox', { name: copy.form.email, exact: true });
    const message = form.getByRole('textbox', { name: copy.form.message, exact: true });
    await expect(name).toHaveAttribute('maxlength', '100');
    await expect(email).toHaveAttribute('maxlength', '150');
    await expect(message).toHaveAttribute('maxlength', '1000');
    await expect(form.getByText('0 / 1000', { exact: true })).toBeVisible();
    await message.fill('Hello');
    await expect(form.getByText('5 / 1000', { exact: true })).toBeVisible();
    await message.fill('x'.repeat(1001));
    await expect(message).toHaveValue('x'.repeat(1000));
    await expect(form.getByText('1000 / 1000', { exact: true })).toBeVisible();
    await message.clear();
    await expect(form.getByText('0 / 1000', { exact: true })).toBeVisible();
  });

  test(`${locale}: an unavailable mail service preserves the message for retry`, async ({
    page,
  }, testInfo) => {
    await page.setExtraHTTPHeaders({
      'x-real-ip': `contact-${locale}-${testInfo.project.name}-${testInfo.retry}`,
    });
    await page.goto(path);
    const form = page.locator('#contact form');
    await form.getByLabel(copy.form.name, { exact: true }).fill('A reader');
    await form.getByLabel(copy.form.email, { exact: true }).fill('reader@example.com');
    await form
      .getByLabel(copy.form.message, { exact: true })
      .fill('Please keep this message when sending fails.');
    await form.getByRole('button', { name: copy.form.send, exact: true }).click();
    await expect(page.getByText(copy.errors.notConfigured, { exact: true })).toBeVisible();
    await expect(form.getByLabel(copy.form.name, { exact: true })).toHaveValue('A reader');
    await expect(form.getByLabel(copy.form.email, { exact: true })).toHaveValue(
      'reader@example.com',
    );
    await expect(form.getByLabel(copy.form.message, { exact: true })).toHaveValue(
      'Please keep this message when sending fails.',
    );
    await expect(form.getByRole('button', { name: copy.form.send, exact: true })).toBeEnabled();
  });

  test(`${locale}: successful action resets the form and enforces the one-minute cooldown`, async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto(path);
    const form = page.locator('#contact form');
    await form.getByLabel(copy.form.name, { exact: true }).fill('A reader');
    await form.getByLabel(copy.form.email, { exact: true }).fill('reader@example.com');
    await form.getByLabel(copy.form.message, { exact: true }).fill('A successful form submission.');
    // The honeypot returns success without sending mail, exercising the real action safely.
    await form.locator('[name=website]').evaluate((el: HTMLInputElement) => {
      el.value = 'https://bot.example';
    });
    await form.getByRole('button', { name: copy.form.send, exact: true }).scrollIntoViewIfNeeded();
    await form.getByRole('button', { name: copy.form.send, exact: true }).click();
    await expect(page.getByText(copy.form.success, { exact: true })).toBeVisible();
    await expect(form.getByRole('button', { name: copy.form.sent, exact: true })).toBeDisabled();
    await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1_000));
    for (const label of [copy.form.name, copy.form.email, copy.form.message]) {
      await expect(form.getByLabel(label, { exact: true })).toBeEmpty();
    }
    await expect(form.getByText('0 / 1000', { exact: true })).toBeVisible();
    await page.clock.fastForward(55_000);
    await expect(form.getByRole('button', { name: copy.form.sent, exact: true })).toBeDisabled();
    await page.clock.fastForward(10_000);
    await expect(form.getByRole('button', { name: copy.form.send, exact: true })).toBeEnabled();
  });
}
