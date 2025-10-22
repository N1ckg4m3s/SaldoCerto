import * as s from './style';

interface ButtonProps {
    label: string;
    onClick: () => void;
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
                {buttons.map((button, index) => (
                    <s.HeaderButton key={index} onClick={button.onClick}>
                        {button.label}
                    </s.HeaderButton>
                ))}
            </s.ButtonGroup>
        </s.TitleContainer>
    );
};

export default PageTitle;
