// Função para gerar senha aleatória
export const generatePassword = (length, type) => {
  let chars = '';
  
  switch (type) {
    case 'numbers':
      chars = '0123456789';
      break;
    case 'letters':
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      break;
    case 'mixed':
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      break;
    case 'complete':
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      break;
    default:
      chars = '0123456789';
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Opções de tipos de senha
export const passwordTypes = [
  { key: 'numbers', label: 'Apenas Números', description: '0-9' },
  { key: 'letters', label: 'Apenas Letras', description: 'A-Z, a-z' },
  { key: 'mixed', label: 'Letras e Números', description: 'A-Z, a-z, 0-9' },
  { key: 'complete', label: 'Completa', description: 'Letras, números e símbolos' },
];

// Função para criar entrada de senha
export const createPasswordEntry = (password, type, length, passwordTypes) => {
  return {
    id: Date.now().toString(),
    password: password,
    type: passwordTypes.find(t => t.key === type)?.label || 'Números',
    length: length,
    date: new Date().toLocaleDateString('pt-BR'),
    time: new Date().toLocaleTimeString('pt-BR'),
    timestamp: Date.now(),
  };
};