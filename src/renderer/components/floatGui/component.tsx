import type React from 'react';
import * as s from './style';
import type { ReactNode } from 'react';

interface props {
    title: string,
    children: ReactNode,
    onClose: () => void
}

const InterfaceFlutuante: React.FC<props> = ({ title, children, onClose }) => {
    return (
        <s.BlurBackground onClick={onClose} >
            <s.InterfaceBackground onClick={(e) => e.stopPropagation()}>
                <s.HeaderContainer>
                    <s.TitleContainer>
                        <span>{title}</span>
                        <s.CloseButton onClick={onClose} >X</s.CloseButton>
                    </s.TitleContainer>
                </s.HeaderContainer>
                {children}
            </s.InterfaceBackground>
        </s.BlurBackground>
    );
};

export default InterfaceFlutuante;
