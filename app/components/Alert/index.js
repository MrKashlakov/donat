import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: yellow
`;

function Alert({ children }) {
  return (
    <Wrapper>{children}</Wrapper>
  );
}

export default Alert;
