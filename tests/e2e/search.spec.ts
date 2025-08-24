import { test, expect } from "@playwright/test";

test("busca usuário e mostra card + gráfico", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Usuário do GitHub").fill("torvalds");
  await page.getByRole("button", { name: "Buscar" }).click();

  await expect(page.getByLabel("Resumo do usuário")).toBeVisible();
  await expect(page.getByText("@torvalds")).toBeVisible();

  // gráfico aparece (container com heading)
  await expect(page.getByRole("heading", { name: /Top Repositórios/i })).toBeVisible();
});

test("mostra erro quando usuário não existe", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Usuário do GitHub").fill("usuario-que-nao-existe-xyz-123");
  await page.getByRole("button", { name: "Buscar" }).click();

  await expect(page.getByRole("alert")).toBeVisible();
});
