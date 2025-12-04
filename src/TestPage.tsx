import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

type Language = 'en' | 'ko';

interface QuestionnaireData {
  anxiety_level: number;
  self_esteem: number;
  mental_health_history: number;
  depression: number;
  headache: number;
  blood_pressure: number;
  sleep_quality: number;
  breathing_problem: number;
  noise_level: number;
  living_conditions: number;
  safety: number;
  basic_needs: number;
  academic_performance: number;
  study_load: number;
  teacher_student_relationship: number;
  future_career_concerns: number;
  social_support: number;
  peer_pressure: number;
  extracurricular_activities: number;
  bullying: number;
}

function StressTest() {
  const [lang, setLang] = useState<Language>('en');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredAnswer, setHoveredAnswer] = useState<number | null>(null);
  const [isLangHovered, setIsLangHovered] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const questions = {
    en: [
      { key: 'anxiety_level', text: 'How would you rate your anxiety level?', range: [0, 4], labels: ['None', 'Mild', 'Moderate', 'High', 'Severe'] },
      { key: 'self_esteem', text: 'How would you rate your self-esteem?', range: [0, 4], labels: ['Very Low', 'Low', 'Average', 'High', 'Very High'] },
      { key: 'mental_health_history', text: 'Do you have a history of mental health issues?', range: [0, 1], labels: ['No', 'Yes'] },
      { key: 'depression', text: 'How would you rate your depression level?', range: [0, 4], labels: ['None', 'Mild', 'Moderate', 'High', 'Severe'] },
      { key: 'headache', text: 'How often do you experience headaches?', range: [1, 5], labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { key: 'blood_pressure', text: 'How would you rate your blood pressure concerns?', range: [1, 3], labels: ['Low', 'Normal', 'High'] },
      { key: 'sleep_quality', text: 'How would you rate your sleep quality?', range: [1, 5], labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] },
      { key: 'breathing_problem', text: 'How often do you experience breathing problems?', range: [1, 5], labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { key: 'noise_level', text: 'How would you rate the noise level in your environment?', range: [1, 5], labels: ['Very Quiet', 'Quiet', 'Moderate', 'Loud', 'Very Loud'] },
      { key: 'living_conditions', text: 'How would you rate your living conditions?', range: [1, 5], labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] },
      { key: 'safety', text: 'How safe do you feel in your environment?', range: [1, 5], labels: ['Very Unsafe', 'Unsafe', 'Neutral', 'Safe', 'Very Safe'] },
      { key: 'basic_needs', text: 'Are your basic needs (food, shelter, etc.) met?', range: [1, 5], labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
      { key: 'academic_performance', text: 'How would you rate your academic performance?', range: [1, 5], labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'] },
      { key: 'study_load', text: 'How would you rate your study workload?', range: [1, 5], labels: ['Very Light', 'Light', 'Moderate', 'Heavy', 'Very Heavy'] },
      { key: 'teacher_student_relationship', text: 'How would you rate your relationship with teachers?', range: [1, 5], labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] },
      { key: 'future_career_concerns', text: 'How concerned are you about your future career?', range: [1, 5], labels: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'] },
      { key: 'social_support', text: 'How would you rate your social support system?', range: [1, 3], labels: ['Poor', 'Fair', 'Good'] },
      { key: 'peer_pressure', text: 'How much peer pressure do you experience?', range: [1, 5], labels: ['None', 'A little', 'Moderate', 'High', 'Very High'] },
      { key: 'extracurricular_activities', text: 'How involved are you in extracurricular activities?', range: [1, 5], labels: ['Not at all', 'Minimally', 'Moderately', 'Very', 'Extremely'] },
      { key: 'bullying', text: 'Have you experienced bullying?', range: [1, 5], labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
    ],
    ko: [
      { key: 'anxiety_level', text: '불안 수준을 평가해주세요', range: [1, 5], labels: ['없음', '약함', '보통', '높음', '매우 높음'] },
      { key: 'self_esteem', text: '자존감을 평가해주세요', range: [1, 5], labels: ['매우 낮음', '낮음', '보통', '높음', '매우 높음'] },
      { key: 'mental_health_history', text: '정신 건강 문제 이력이 있습니까?', range: [0, 1], labels: ['아니오', '예'] },
      { key: 'depression', text: '우울감 수준을 평가해주세요', range: [1, 5], labels: ['없음', '약함', '보통', '높음', '매우 높음'] },
      { key: 'headache', text: '두통을 얼마나 자주 경험합니까?', range: [1, 5], labels: ['전혀', '드물게', '가끔', '자주', '매우 자주'] },
      { key: 'blood_pressure', text: '혈압 상태를 평가해주세요', range: [1, 3], labels: ['낮음', '정상', '높음'] },
      { key: 'sleep_quality', text: '수면의 질을 평가해주세요', range: [1, 5], labels: ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'] },
      { key: 'breathing_problem', text: '호흡 문제를 얼마나 자주 경험합니까?', range: [1, 5], labels: ['전혀', '드물게', '가끔', '자주', '매우 자주'] },
      { key: 'noise_level', text: '주변 소음 수준을 평가해주세요', range: [1, 5], labels: ['매우 조용', '조용', '보통', '시끄러움', '매우 시끄러움'] },
      { key: 'living_conditions', text: '생활 환경을 평가해주세요', range: [1, 5], labels: ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'] },
      { key: 'safety', text: '환경이 얼마나 안전하다고 느낍니까?', range: [1, 5], labels: ['매우 불안전', '불안전', '보통', '안전', '매우 안전'] },
      { key: 'basic_needs', text: '기본 욕구(음식, 주거 등)가 충족됩니까?', range: [1, 5], labels: ['전혀', '드물게', '가끔', '자주', '항상'] },
      { key: 'academic_performance', text: '학업 성적을 평가해주세요', range: [1, 5], labels: ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'] },
      { key: 'study_load', text: '학업 부담을 평가해주세요', range: [1, 5], labels: ['매우 가벼움', '가벼움', '보통', '무거움', '매우 무거움'] },
      { key: 'teacher_student_relationship', text: '교수와의 관계를 평가해주세요', range: [1, 5], labels: ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'] },
      { key: 'future_career_concerns', text: '미래 진로에 대해 얼마나 걱정됩니까?', range: [1, 5], labels: ['전혀', '약간', '보통', '매우', '극도로'] },
      { key: 'social_support', text: '사회적 지원 체계를 평가해주세요', range: [1, 3], labels: ['나쁨', '보통', '좋음'] },
      { key: 'peer_pressure', text: '또래 압력을 얼마나 경험합니까?', range: [1, 5], labels: ['없음', '약간', '보통', '높음', '매우 높음'] },
      { key: 'extracurricular_activities', text: '과외 활동에 얼마나 참여합니까?', range: [1, 5], labels: ['전혀', '최소한', '보통', '많이', '매우 많이'] },
      { key: 'bullying', text: '괴롭힘을 경험한 적이 있습니까?', range: [1, 5], labels: ['전혀', '드물게', '가끔', '자주', '매우 자주'] },
    ]
  };

  const currentQ = questions[lang][currentQuestion];
  const totalQuestions = questions[lang].length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (value: number) => {
    const key = currentQ.key as keyof QuestionnaireData;
    setAnswers({ ...answers, [key]: value });

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest({ ...answers, [key]: value });
    }
  };

  const submitTest = async (finalAnswers: Partial<QuestionnaireData>) => {
    setIsSubmitting(true);
    
    try {

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalAnswers),
      });

      const data = await response.json();
      setResult(data.stress_level); // Adjust based on your API response
    } catch (error) {
      console.error('Error:', error);
      // For demo purposes, show a mock result
      setResult('distress');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    const resultTexts = {
      en: {
        'no stress': { title: 'No Stress Detected', desc: 'You seem to be managing well!' },
        'eustress': { title: 'Positive Stress (Eustress)', desc: 'You have healthy, motivating stress levels.' },
        'distress': { title: 'Distress Detected', desc: 'Consider seeking support or stress management resources.' }
      },
      ko: {
        'no stress': { title: '스트레스 없음', desc: '잘 관리하고 계시네요!' },
        'eustress': { title: '긍정적 스트레스', desc: '건강하고 동기부여가 되는 스트레스 수준입니다.' },
        'distress': { title: '부정적 스트레스', desc: '지원이나 스트레스 관리 자원을 찾아보세요.' }
      }
    };

    const resultInfo = resultTexts[lang][result as keyof typeof resultTexts['en']] || resultTexts[lang]['distress'];

    return (
      <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <button
          onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
          onMouseEnter={() => setIsLangHovered(true)}
          onMouseLeave={() => setIsLangHovered(false)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: isLangHovered ? 'var(--bg-secondary)' : 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            zIndex: 1000, 
            transition: 'all 0.2s ease'
          }}
        >
          {lang === 'en' ? '한국어로 보기' : 'View in English'}
        </button>

        <h1 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>{resultInfo.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '40px' }}>{resultInfo.desc}</p>
        
        <button
          onClick={resetTest}
          style={{
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          {lang === 'en' ? 'Take Test Again' : '다시 테스트하기'}
        </button>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '20px',
        color: 'var(--text-secondary)'
      }}>
        {lang === 'en' ? 'Analyzing your responses...' : '응답을 분석하는 중...'}
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '700px', margin: '0 auto' }}>
      <button
        onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
        onMouseEnter={() => setIsLangHovered(true)}
        onMouseLeave={() => setIsLangHovered(false)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          fontSize: '14px',
          cursor: 'pointer',
          backgroundColor: isLangHovered ? 'var(--bg-secondary)' : 'var(--bg-primary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          zIndex: 1000, 
        }}
      >
        {lang === 'en' ? '한국어로 보기' : 'View in English'}
      </button>

      {/* Progress bar */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--border-color)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: 'var(--accent)',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <p style={{ textAlign: 'center', marginTop: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          {lang === 'en' ? `Question ${currentQuestion + 1} of ${totalQuestions}` : `질문 ${currentQuestion + 1} / ${totalQuestions}`}
        </p>
      </div>

      {/* Question */}
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '30px', textAlign: 'center' }}>
        {currentQ.text}
      </h2>

      {/* Answer options */}
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  marginTop: '20px'
}}>
  {Array.from({ length: currentQ.range[1] - currentQ.range[0] + 1 }, (_, i) => {
    const value = currentQ.range[0] + i;
    const label = currentQ.labels?.[i] || value.toString();

    // Detect dark mode
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
      <button
        key={value}
        onClick={() => handleAnswer(value)}
        onMouseEnter={() => setHoveredAnswer(value)}
        onMouseLeave={() => setHoveredAnswer(null)}
        style={{
          width: '100%',
          padding: '18px 22px',
          fontSize: '16px',
          fontWeight: 500,
          borderRadius: '10px',
          cursor: 'pointer',
          backgroundColor: hoveredAnswer === value ? (isDarkMode ? '#333' : '#fff5f0') : 'var(--bg-primary)',
          color: hoveredAnswer === value ? (isDarkMode ? '#ffffff' : '#000000') : 'var(--text-primary)',
          border: `2px solid ${hoveredAnswer === value ? 'var(--accent)' : 'var(--border-color)'}`,
          boxShadow: hoveredAnswer === value
            ? '0 6px 15px rgba(0,0,0,0.1)'
            : '0 2px 4px rgba(0,0,0,0.05)',
          transform: hoveredAnswer === value ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.25s ease',
          textAlign: 'center',
        }}
      >
        {label}
      </button>
    );
  })}
</div>



      {/* Back button */}
      {currentQuestion > 0 && (
        <button
          onClick={handleBack}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            display: 'block',
            margin: '30px auto 0'
          }}
        >
          {lang === 'en' ? '← Back' : '← 이전'}
        </button>
      )}
    </div>
  );
}

export default StressTest;