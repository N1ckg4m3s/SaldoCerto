import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const validateBancoRestore = async (path: string): Promise<[boolean, string]> => {
    const db = await open({
        filename: path,
        driver: sqlite3.Database,
    });

    try {
        // 1️⃣ Verifica tabelas obrigatórias
        const requiredTables = ["Cliente", "Movimentacao", "Configuracao"];
        const tables = await db.all(
            `SELECT name FROM sqlite_master WHERE type='table'`
        );
        const tableNames = tables.map((t) => t.name);

        for (const t of requiredTables) {
            if (!tableNames.includes(t)) {
                throw new Error(`Tabela ausente: ${t}`);
            }
        }

        // 2️⃣ Verifica colunas essenciais
        const checkColumns = async (table: string, expected: string[]) => {
            const pragma = await db.all(`PRAGMA table_info(${table})`);
            const columns = pragma.map((c) => c.name);
            for (const col of expected) {
                if (!columns.includes(col)) {
                    throw new Error(`Coluna ausente em ${table}: ${col}`);
                }
            }
        };

        await checkColumns("Cliente", ["id", "nome", "telefone", "tipoContrato", "diaContrato"]);
        await checkColumns("Movimentacao", ["id", "tipo", "data", "valor", "pago", "clienteId"]);
        await checkColumns("Configuracao", ["id", "backupFilesPath", "maxBackups", "backupInterval", "movimentacaoExpiraEmDias", "lastBackup"]);

        // 3️⃣ Id duplicado no cliente
        const duplicates = await db.get(`
            SELECT COUNT(id) - COUNT(DISTINCT id) as dupCount
            FROM Cliente
        `);
        if (duplicates.dupCount > 0) {
            throw new Error('Existem clientes com IDs duplicados no backup.');
        }

        // 4️⃣ Todos as movimentações tem idClient valido.
        const result = await db.get(`
            SELECT COUNT(*) as invalidCount
            FROM Movimentacao m
            LEFT JOIN Cliente c ON m.clienteId = c.id
            WHERE c.id IS NULL
        `);

        if (result.invalidCount > 0) {
            throw new Error(`Foram encontradas ${result.invalidCount} movimentações sem cliente válido.`);
        }

        // 5️⃣ Integridade do banco
        const integrity = await db.get("PRAGMA integrity_check;");
        if (integrity.integrity_check !== "ok") {
            throw new Error("Integridade do banco corrompida.");
        }

        return [true, '']
    } catch (e: any) {
        return [false, e?.message || '']
    } finally {
        db.close()
    }
}