import { Link } from "react-router-dom";
import { flexCenter } from "../../sheredStyles";
import styled, { css } from "styled-components";
import { GlobalSpacing } from "../../globalStyleInformations";

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
    background-color: ${props => (props.Selected ? 'black' : 'transparent')};
    border-radius: 5px;
    color: ${props => (props.Selected ? 'white' : 'black')};;

    text-decoration: none;
    font-weight: bold;

    ${props =>
    !props.Selected &&
    css`
      transition: all 0.2s;
      &:hover {
        background-color: black;
        color: white;
      }
    `}
`;