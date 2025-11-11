import { Link } from "react-router-dom";
import { flexCenter } from "../../sheredStyles";
import styled, { css } from "styled-components";
import { themeGet } from "@renderer/globalStyleInformations";

export const NavBarContainer = styled.header`
    width: 100%;
    ${flexCenter}
    padding: ${themeGet(t => t.GlobalSpacing.Small)};
`;

interface NavLinkProps {
  Selected?: boolean;
}

export const NavLink = styled(Link) <NavLinkProps>`
    padding: ${themeGet(t => t.GlobalSpacing.Small)};
    margin: ${themeGet(t => t.GlobalSpacing.Small)};
    background-color: ${props => (props.Selected ? themeGet(t => t.GlobalBackgroundColor.Black) : 'transparent')};
    border-radius: 5px;
    color: ${props => (props.Selected ? themeGet(t => t.GlobalTextColor.White) : themeGet(t => t.GlobalTextColor.Black))};;

    text-decoration: none;
    font-weight: bold;

    font-size: ${themeGet(t => t.GlobalTextSize.Base)};

    ${props =>
    !props.Selected &&
    css`
      transition: all 0.2s;
      &:hover {
        background-color: ${themeGet(t => t.GlobalBackgroundColor.Black)};
        color: ${themeGet(t => t.GlobalTextColor.White)};
      }
    `}
`;