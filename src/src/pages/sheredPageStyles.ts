import { Link } from "react-router-dom";
import styled from "styled-components";
import { GlobalTextColor } from "../globalStyleInformations";

export const MainPageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`

export const CleanReacrLink = styled(Link)`
    text-decoration: none;
    color: ${GlobalTextColor.Black}
`