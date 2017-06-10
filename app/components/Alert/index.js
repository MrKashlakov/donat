import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 200px;
  padding: 21px;
  border-radius: 5px;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  font-size: 17px;
  line-height: 21px;
  margin-bottom: 4px;
`;

const Username = styled.div`
  flex-grow: 1;
  font-weight: bold;
`;

const Sum = styled.div`
  color: #949390;
`;

const Message = styled.div`
  font-size: 13px;
  line-height: 17px;
`;

function Alert({ username, sum, message }) {
  return (
    <Wrapper>
      <Header>
        <Username>{username}</Username>
        <Sum>${sum}</Sum>
      </Header>
      <Message>{message}</Message>
    </Wrapper>
  );
}

export default Alert;
