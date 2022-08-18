import styled from "styled-components";

export const SideBarArea = styled.div`
  max-width: 73px;
  min-width: 73px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  padding: 25px 0px;
  @media (max-width: 1024px) {
    max-width: min-content;
    min-width: min-content;
    padding: 10px 10px;
  }
`;

export const RoundedButtonIcon = styled.img.attrs({
  alt: "",
})`
  width: 56%;
`;
