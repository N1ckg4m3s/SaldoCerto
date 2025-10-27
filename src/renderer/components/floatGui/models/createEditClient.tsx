import type { Cliente } from "@renderer/shered/types"

interface props {
    onError: () => void
    onComplete: () => void
    Cliente?: Cliente // momentaneamente
}

export const CreateEditClient_FloatGuiModule: React.FC<props> = ({ onComplete, onError, Cliente }) => {
    return (
        <div>CREATE EDIT CLIENT</div>
    );
}