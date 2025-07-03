import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useTranslation } from 'react-i18next';
import './i18n';
import Loader from './components/Loader';
import { questionTypes } from './questions';

const pastelColors = ['#FFE5EC', '#E0BBE4', '#B5EAD7', '#C7CEEA', '#FFF1BA'];

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Pretendard', 'Montserrat', 'Arial', sans-serif;
    background: linear-gradient(135deg, #ffe5ec 0%, #b5ead7 100%);
    min-height: 100vh;
  }
`;

const Container = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 12px 48px 12px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  min-height: 80vh;
  @media (max-width: 480px) {
    padding: 12px 0 32px 0;
    border-radius: 0;
    min-height: 100vh;
  }
`;

const Title = styled.h1`
  font-size: 2.1rem;
  font-weight: 700;
  text-align: center;
  color: #B388FF;
  margin-bottom: 40px;
  letter-spacing: -1px;
`;

const Button = styled.button`
  width: 100%;
  padding: 18px 0;
  background: linear-gradient(90deg, #b5ead7 0%, #ffe5ec 100%);
  color: #5E548E;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 16px;
  margin-top: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: background 0.2s;
  &:hover { background: #E0BBE4; }
`;

const Option = styled(Button)`
  margin: 12px 0;
  background: ${({ idx }) => pastelColors[idx % pastelColors.length]};
  color: #22223B;
  font-weight: 500;
  font-size: 1.1rem;
`;

const Progress = styled.div`
  width: 100%;
  height: 8px;
  background: #f3eaff;
  border-radius: 4px;
  margin-bottom: 32px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: linear-gradient(90deg, #b5ead7 0%, #b388ff 100%);
  transition: width 0.3s;
`;

const ResultCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.09);
  padding: 32px 16px 24px 16px;
  text-align: center;
`;

const ShareRow = styled.div`
  display: flex; gap: 12px; margin-top: 32px; justify-content: center;
`;

const ShareBtn = styled(Button)`
  width: auto; padding: 12px 28px; font-size: 1rem; margin-top: 0;
`;

function App() {
  const { t } = useTranslation();
  const [step, setStep] = useState('start');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultType, setResultType] = useState(null);

  // 질문 데이터
  const questions = t('questions', { returnObjects: true });

  const handleStart = () => {
    setStep(0);
    setAnswers([]);
    setResultType(null);
  };

  const handleOption = (idx) => {
    const newAnswers = [...answers, questionTypes[step][idx]];
    if (newAnswers.length === questions.length) {
      setStep('resultBtn');
    } else {
      setStep(step + 1);
      setAnswers(newAnswers);
    }
  };

  const handleShowResult = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // 집계
      const count = {};
      answers.forEach(a => { count[a] = (count[a] || 0) + 1; });
      const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
      setResultType(top);
      setStep('result');
    }, 3000);
  };

  const handleShare = () => {
    // POST로 결과 공유 (예시)
    const shareData = {
      result: t(`results.${resultType}.title`),
      desc: t(`results.${resultType}.desc`)
    };
    fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shareData)
    });
    alert(t('shared'));
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t('copied'));
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        {step === 'start' && (
          <>
            <Title>{t('appTitle')}</Title>
            <Button onClick={handleStart}>{t('start')}</Button>
          </>
        )}
        {typeof step === 'number' && (
          <>
            <Progress>
              <ProgressBar percent={Math.round((step / questions.length) * 100)} />
            </Progress>
            <Title style={{ fontSize: '1.3rem', marginBottom: 24 }}>{questions[step].q}</Title>
            {questions[step].opts.map((opt, idx) => (
              <Option key={idx} idx={idx} onClick={() => handleOption(idx)}>
                {opt}
              </Option>
            ))}
          </>
        )}
        {step === 'resultBtn' && (
          <>
            <Button onClick={handleShowResult}>{t('showResult')}</Button>
          </>
        )}
        {loading && (
          <div style={{ minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Loader />
            <div style={{ color: '#B388FF', fontWeight: 600, fontSize: '1.2rem', marginTop: 16 }}>
              {t('analyzing')}
            </div>
          </div>
        )}
        {step === 'result' && resultType && (
          <ResultCard>
            <h2 style={{ fontSize: '2rem', color: '#B388FF', marginBottom: 12 }}>
              {t(`results.${resultType}.title`)}
            </h2>
            <div style={{
              color: '#5E548E',
              fontSize: '1.1rem',
              marginBottom: 24,
              whiteSpace: 'pre-line' // 줄바꿈 적용!
            }}>
              {t(`results.${resultType}.desc`)}
            </div>
            <ShareRow>
              <ShareBtn onClick={handleShare}>{t('shareResult')}</ShareBtn>
              <ShareBtn onClick={handleCopyUrl}>{t('shareApp')}</ShareBtn>
            </ShareRow>
          </ResultCard>
        )}
      </Container>
    </>
  );
}

export default App;
