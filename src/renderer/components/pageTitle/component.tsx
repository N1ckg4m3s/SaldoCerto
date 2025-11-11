import { useTheme } from 'styled-components';
import * as s from './style';

interface ButtonProps {
    label: string;
    onClick: (dados?: any) => void;
}

interface PageTitleProps {
    titulo: string;
    buttons?: ButtonProps[];
}

const PageTitle: React.FC<PageTitleProps> = ({ titulo, buttons = [] }) => {
    const theme = useTheme(); // 👈 pega o tema atual (dark/light, etc.)
    const colors = ((theme as any).HeaderTitleButtonColors ?? []) as string[];

    return (
        <s.TitleContainer>
            <s.TitleH1>{titulo}</s.TitleH1>
            <s.ButtonGroup>
                {buttons.map((button, index) => {
                    const color = colors[index % colors.length] || '';
                    return (
                        <s.HeaderButton key={index} color={color} onClick={button.onClick}>
                            {button.label}
                        </s.HeaderButton>
                    );
                })}
            </s.ButtonGroup>
        </s.TitleContainer>
    );
};

export default PageTitle;
