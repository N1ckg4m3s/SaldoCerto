import { HeaderTitleButtonColors } from '../../globalStyleInformations';
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
    return (
        <s.TitleContainer>
            <s.TitleH1>{titulo}</s.TitleH1>
            <s.ButtonGroup>
                {buttons.map((button, index) => {
                    const color = HeaderTitleButtonColors[index % HeaderTitleButtonColors.length] || '';
                    return (
                        <s.HeaderButton
                            key={index}
                            color={color}
                            onClick={button.onClick}
                        >
                            {button.label}
                        </s.HeaderButton>
                    );
                })}
            </s.ButtonGroup>

        </s.TitleContainer>
    );
};

export default PageTitle;
