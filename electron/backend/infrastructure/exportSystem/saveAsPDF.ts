import fs from "fs";
import os from "os";
import path from "path";
import { BrowserWindow, shell } from "electron";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Template HTML
const templatePath = path.join(__dirname, "..", "..", "..", "assets", "template.html");

// Formatação
const formatacaoData = (d: any) => {
    if (!d) return "-";
    const date = new Date(d);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR");
};

const formatacaoValor = (v: any) => {
    if (v == null) return "-";
    return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

interface props {
    baseName: string,
    list: Record<string, any>,
    information?: Record<string, any>,
    appName: string
}

export const saveAsPDF = async ({
    baseName = "Relatorio",
    list = [],
    information = [],
    appName = "Saldo Certo"
}: props) => {
    try {
        // Lê o template
        const templateHTML = await fs.promises.readFile(templatePath, "utf-8");
        let filledHTML = templateHTML;

        // 1️⃣ [Insersão de informações base]
        filledHTML = filledHTML
            .replace(/\{\{TITLE\}\}/g, baseName)
            .replace(/\{\{GEN_DATE\}\}/g, new Date().toLocaleString("pt-BR"))
            .replace(/\{\{TOTAL\}\}/g, list.length.toString())
            .replace(/\{\{APP_NAME\}\}/g, appName)

        // 2️⃣ [Insersão de informação de cliente -information-]
        const hasInfo = Array.isArray(information) && information.length > 0;
        const client = hasInfo ? information[0] : null;
        const clientInfoDisplay = hasInfo && Object.keys(client).length > 0 ? "block" : "none";

        if (hasInfo) {
            filledHTML = filledHTML
                .replace(/\{\{CLIENT_CONTATO\}\}/g, client?.CLIENT_CONTATO || "-")
                .replace(/\{\{CLIENT_CONTRATO\}\}/g, client?.CLIENT_CONTRATO)
                .replace(/\{\{CLIENT_DIVIDA\}\}/g, client?.CLIENT_DIVIDA)
                .replace(/\{\{CLIENT_PROX_PAG\}\}/g, client?.CLIENT_PROX_PAG)
                .replace(/\{\{CLIENT_VALOR_PAG\}\}/g, client?.CLIENT_VALOR_PAG);
        }
        filledHTML = filledHTML
            .replace("{{SHOW_CLIENT_INFO_DISPLAY}}", `style='display: ${clientInfoDisplay};'`)

        // 3️⃣ [Insersão de lista]
        // Monta information (movimentações)
        const secHeaders = list.length ? Object.keys(list[0]) : [];
        const secHeadersHtml = secHeaders.map(h => `<th>${h}</th>`).join("");

        const secRowsHtml = list
            .map((row: any) =>
                `<tr>${secHeaders.map(h => `<td>${row[h] ?? "-"}</td>`).join("")}</tr>`
            )
            .join("");


        // Substitui placeholders
        filledHTML = filledHTML
            .replace(/\{\{SEC_HEADERS\}\}/g, secHeadersHtml)
            .replace(/\{\{SEC_ROWS\}\}/g, secRowsHtml)

        // Cria janela invisível do Electron
        const win = new BrowserWindow({ show: false, webPreferences: { offscreen: true } });
        await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(filledHTML));

        // Caminho do PDF
        const downloadsDir = path.join(os.homedir(), "Downloads");
        if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        const filePath = path.join(downloadsDir, `${baseName}-${dateStr}.pdf`);

        // Gera PDF
        const pdfBuffer = await win.webContents.printToPDF({ printBackground: true });
        await fs.promises.writeFile(filePath, pdfBuffer);

        win.destroy();
        shell.showItemInFolder(filePath);

        return { filePath, total: information.length };
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        throw err;
    }
};