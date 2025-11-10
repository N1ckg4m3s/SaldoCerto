import { ApiCaller } from '@renderer/controler/ApiCaller'
import * as s from '../style'
import * as sh from './sheredModulesStyle'
import { useState } from 'react'
import { useNotification } from '@renderer/components/notificationContainer/notificationContext'
import LoadingComponent from '@renderer/components/loading/component'

export const ConfigRestauracaoModule = () => {
    const { addNotification } = useNotification()
    const [arquivePath, setArquivePath] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);

    const handleSelectRecoveryArquive = () => {
        ApiCaller({
            url: '/backup/selectRecoveryArquive',
            onSuccess: (response: any) => {
                console.log(response)
                if (response.data?.path) {
                    setArquivePath(response.data.path);
                }
            },
            onError(erro) {
                addNotification({
                    id: String(Date.now()),
                    title: 'Erro ao selecionar arquivo',
                    type: 'error',
                    message: erro.message || ''
                })
            },
        })
    }

    const handleRecoevery = () => {
        if (arquivePath === '') {
            addNotification({
                id: String(Date.now()),
                title: "Erro ao restaurar",
                type: 'error',
                message: 'Arquivo não selecionado'
            })
            return; // para a execução
        }

        const payload = { path: arquivePath }

        setLoading(true)

        ApiCaller({
            url: '/backup/restoreFromBackupFile',
            args: payload,
            onSuccess: (response: any) => {
                if (response.success) {
                    addNotification({
                        id: String(Date.now()),
                        title: "Restauração completa",
                        message: "A restauração foi concluida com sucesso",
                        type: 'success',
                    })
                    setLoading(false)
                }
            },
            onError(erro) {
                addNotification({
                    id: String(Date.now()),
                    title: "Erro ao restaurar arquivos",
                    type: 'error',
                    message: erro.message || ''
                })
                setLoading(false)
            },
        })
    }

    const ShowPastaName = (): string => {
        const caminho = arquivePath?.trim();
        if (!caminho) return '-erro-';

        const partes = caminho.split(/[/\\]+/); // separa tanto / quanto \
        const nomePasta = partes.pop(); // última parte
        return nomePasta || '-erro-';
    };

    if (loading) return <LoadingComponent />

    return (
        <s.SectionContainer_Danger>
            <s.SectionTitle_Danger> Restauração de dados (⚠️ uso avançado) </s.SectionTitle_Danger>

            <s.SectionMessage_Danger>
                A restauração substitui todos os dados atuais pelos dados do backup selecionado.
                <br />
                Use apenas se tiver certeza do que está fazendo!
                <br /> <br />
                (Ao restaurar sera criado um backup atual)
            </s.SectionMessage_Danger>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Arquivo para restaurar:</sh.ModuleFormLabel>
                <sh.FieldTip>I
                    <span> Arquivo usado restaurar </span>
                </sh.FieldTip>
                <sh.ModuleFormButton type="button"
                    onClick={handleSelectRecoveryArquive}
                >
                    {arquivePath ?
                        `Arquivo Selecionado: [...\\${ShowPastaName()}]`
                        : 'Selecionar Arquivo'}
                </sh.ModuleFormButton>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormButton onClick={handleRecoevery}> Restaurar dados </sh.ModuleFormButton>
            </sh.ModuleFieldRow>
        </s.SectionContainer_Danger>
    )
}