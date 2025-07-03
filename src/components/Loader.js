import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

const LoaderDiv = styled.div`
  margin: 32px 0 16px 0;
  width: 48px; height: 48px;
  border: 5px solid #E0BBE4;
  border-top: 5px solid #B5EAD7;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export default function Loader() {
  return <LoaderDiv />;
}
