import { test, expect } from '@playwright/test';

/**
 * Tests d'intégration end-to-end (navigateur réel via Playwright).
 * Vérifient le parcours complet : saisie → rendu du QR dans un vrai <canvas> →
 * téléchargement. Le serveur de prévisualisation est lancé automatiquement
 * (voir playwright.config.ts).
 */
test.describe('Générateur de QR code', () => {
  test('affiche le titre et le type Texte par défaut', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Générateur de QR code' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Texte' })).toHaveAttribute('aria-selected', 'true');
  });

  test('génère un QR après saisie de texte', async ({ page }) => {
    await page.goto('/');
    // Au départ, aucun QR : message d'invite.
    await expect(page.getByText(/Remplissez le formulaire/i)).toBeVisible();
    await page.getByLabel('Texte').fill('Bonjour Playwright');
    // Le canvas du QR apparaît une fois le texte saisi.
    await expect(page.getByTestId('qr-canvas')).toBeVisible();
  });

  test('génère un QR WiFi et permet le téléchargement PNG', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'WiFi' }).click();
    await page.getByLabel('Nom du réseau (SSID)').fill('MonReseau');
    await page.getByLabel('Mot de passe').fill('motdepasse');
    await expect(page.getByTestId('qr-canvas')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Télécharger PNG' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('qrcode-wifi.png');
  });

  test('bascule le thème clair/sombre', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const wasDark = await html.evaluate((el) => el.classList.contains('dark'));
    await page.getByRole('button', { name: /thème/i }).click();
    const isDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(isDark).toBe(!wasDark);
  });

  test('bascule la langue en anglais', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Générateur de QR code' })).toBeVisible();
    await page.getByRole('button', { name: 'Passer en anglais' }).click();
    await expect(page.getByRole('heading', { name: 'QR code generator' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
