import { test, expect, type Page } from '@playwright/test';

/**
 * Tests d'intégration end-to-end (navigateur réel via Playwright).
 * Vérifient le parcours complet : saisie → rendu du QR dans un vrai <canvas> →
 * téléchargement. Le serveur de prévisualisation est lancé automatiquement
 * (voir playwright.config.ts).
 */

/**
 * Le QR est dessiné de façon ASYNCHRONE par `qr-code-styling` : il ajoute un
 * `<canvas>` dans le conteneur `qr-canvas` une fois l'image prête. On attend donc
 * ce `<canvas>` enfant, et pas seulement le conteneur (qui existe avant le rendu).
 */
function renderedQr(page: Page) {
  return page.locator('[data-testid="qr-canvas"] canvas');
}

test.describe('Générateur de QR code', () => {
  test('affiche le titre et le type Texte par défaut', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Générateur de QR code' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Texte' })).toHaveAttribute('aria-checked', 'true');
  });

  test('génère un QR après saisie de texte', async ({ page }) => {
    await page.goto('/');
    // Au départ, aucun QR : message d'invite.
    await expect(page.getByText(/Remplissez le formulaire/i)).toBeVisible();
    await page.getByRole('textbox', { name: 'Texte' }).fill('Bonjour Playwright');
    // Le <canvas> du QR apparaît une fois le texte saisi et le rendu terminé.
    await expect(renderedQr(page)).toBeVisible();
  });

  test('génère un QR WiFi et permet le téléchargement PNG', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('radio', { name: 'WiFi' }).click();
    await page.getByLabel('Nom du réseau (SSID)').fill('MonReseau');
    await page.getByLabel('Mot de passe').fill('motdepasse');
    await expect(renderedQr(page)).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Télécharger PNG' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('qrcode-wifi.png');
  });

  test('bascule le mode clair/sombre', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const wasDark = await html.evaluate((el) => el.classList.contains('dark'));
    await page.getByRole('button', { name: /activer le mode/i }).click();
    const isDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(isDark).toBe(!wasDark);
  });

  test("change d'identité visuelle au runtime", async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Thème').selectOption('aurora');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'aurora');
  });

  test('bascule la langue en anglais', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Générateur de QR code' })).toBeVisible();
    await page.getByRole('button', { name: 'Passer en anglais' }).click();
    await expect(page.getByRole('heading', { name: 'QR code generator' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
