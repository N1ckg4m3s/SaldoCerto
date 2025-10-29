import { useState, useEffect } from "react";
import { ApiCaller } from "@renderer/controler/ApiCaller";
import * as s from '../style'

interface SelectClientProps {
    onSelect: (cliente: { id: string; nome: string }) => void;
    showSelected: string | null
}

export const SelectClient: React.FC<SelectClientProps> = ({ onSelect, showSelected }) => {
    const [query, setQuery] = useState(showSelected || '');
    const [results, setResults] = useState<{ id: string; nome: string }[]>([]);

    const refreshOptions = () => {
        ApiCaller({
            url: `/cliente/searchName`,
            args: { search: query },
            onSuccess(data) {
                setResults(data.data);
            },
        });
    }

    const isEqualTheOnly: boolean = results.length == 1 && results[0]?.nome == query;

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!query || isEqualTheOnly) return setResults([]);
            refreshOptions()
        }, 400);
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <s.SelectClientContainer>
            <s.ModuleFormInput
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar cliente..."
            />
            {!isEqualTheOnly && results.length > 0 && (
                <s.SelectClientSelect>
                    {results.map((c) => (
                        <s.SelectClientOption
                            key={c.id}
                            onClick={() => {
                                onSelect(c);
                                setQuery(c.nome)
                            }}>
                            {c.nome}
                        </s.SelectClientOption>
                    ))}
                </s.SelectClientSelect>
            )}
        </s.SelectClientContainer>
    );
};
