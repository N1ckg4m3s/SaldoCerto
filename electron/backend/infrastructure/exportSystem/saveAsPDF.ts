import fs from "fs";
import os from "os";
import path from "path";
import { shell } from "electron";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Caminho do template HTML
const templatePath = path.join(__dirname, "..", "..", "..", "assets", "template.html");

// Função principal de geração
export const saveAsPDF = async (rows = [], baseName = "Relatório") => {
    try {
        // 1️⃣ Lê o HTML base
        const templateHTML = await fs.promises.readFile(templatePath, "utf-8");

        // 2️⃣ Monta a tabela HTML dentro do template
        const headers = rows.length ? Object.keys(rows[0] || {}) : [];
        const tableHTML = rows.length
            ? `
                <table class="tabela">
                <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
                    <tbody>${rows.map(r =>
                `<tr>${headers.map(h => `<td>${r[h] ?? ""}</td>`).join("")}</tr>`
            ).join("")}</tbody>
                </table>`
            : "<p class='sem-dados'>Nenhum dado encontrado.</p>";

        // 3️⃣ Insere os dados no template
        const filledHTML = templateHTML
            .replace("{{TITULO}}", baseName)
            .replace("{{DATA}}", new Date().toLocaleString())
            .replace("{{TABELA}}", tableHTML);

        // 4️⃣ Cria diretório e caminho do PDF
        const downloadsDir = path.join(os.homedir(), "Downloads");
        const filePath = path.join(downloadsDir, `${baseName}-${Date.now()}.pdf`);
        const doc = new PDFDocument({ margin: 40 });
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // 5️⃣ Gera o PDF (simples: título + tabela com HTML interpretado parcialmente)
        doc.font("Helvetica-Bold").fontSize(18).text(baseName.toUpperCase(), { align: "center" });
        doc.moveDown();

        // Não dá pra renderizar HTML puro no PDFKit, mas dá pra simular o estilo básico
        rows.forEach((r, i) => {
            headers.forEach((h) => {
                const val = String(r[h] ?? "");
                doc.font("Helvetica").fontSize(10).text(`${h}: ${val}`, { continued: false });
            });
            doc.moveDown(0.5);
        });

        doc.end();

        await new Promise<void>((resolve, reject) => {
            writeStream.on("finish", () => resolve());
            writeStream.on("error", reject);
        });

        // 6️⃣ Abre o local do arquivo no Explorer
        shell.showItemInFolder(filePath);

        return { filePath, total: rows.length };
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        throw err;
    }
};
