// 서버 컴포넌트(layout)에서도 쓰는 값이라 React 훅이 들어 있는 brand-theme.ts 와 분리
export const THEME_STORAGE_KEY = 'mumimap-theme';

// 첫 페인트 전에 실행되는 스크립트: 저장된 색을 <html data-theme>에 미리 적용해 깜빡임 방지
export const themeBootScript = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t)document.documentElement.dataset.theme=t}catch(e){}`;
