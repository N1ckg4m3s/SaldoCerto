import { Link } from "react-router-dom";
import { flexCenter } from "../../sheredStyles";
import styled, { css } from "styled-components";
import { GlobalBackgroundColor, GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../globalStyleInformations";

export const NavBarContainer = styled.header`
    width: 100%;
    ${flexCenter}
    padding: ${GlobalSpacing.Small};
`;

interface NavLinkProps {
  Selected?: boolean;
}

export const NavLink = styled(Link) <NavLinkProps>`
    padding: ${GlobalSpacing.Small};
    margin: ${GlobalSpacing.Small};
    background-color: ${props => (props.Selected ? GlobalBackgroundColor.Black : 'transparent')};
    border-radius: 5px;
    color: ${props => (props.Selected ? GlobalTextColor.White : GlobalTextColor.Black)};;

    text-decoration: none;
    font-weight: bold;

    font-size: ${GlobalTextSize.HeadingSmall};

    ${props =>
    !props.Selected &&
    css`
      transition: all 0.2s;
      &:hover {
        background-color: ${GlobalBackgroundColor.Black};
        color: ${GlobalTextColor.White};
      }
    `}
`;