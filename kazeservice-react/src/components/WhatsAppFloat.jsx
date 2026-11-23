import { useState, useEffect } from 'react';
import { getSettings, buildWhatsAppUrl } from '../api/settings';

/**
 * Bouton WhatsApp flottant, unique dans tout le site (avant : dupliqué en dur
 * dans 14 pages avec un numéro figé). Le numéro vient maintenant de
 * site_settings — modifiable depuis l'admin sans toucher au code.
 */
const WhatsAppFloat = () => {
  const [whatsapp, setWhatsapp] = useState(null);

  useEffect(() => {
    getSettings().then((s) => setWhatsapp(s.whatsapp));
  }, []);

  if (!whatsapp) return null;

  return (
    <a
      href={buildWhatsAppUrl(whatsapp)}
      className="whatsapp-float"
      target="_blank"
      rel="noopener"
      aria-label="Contacter sur WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.04 2.667C8.657 2.667 2.667 8.657 2.667 16.04c0 2.573.716 4.98 1.958 7.03L2.667 29.333l6.42-1.933a13.31 13.31 0 0 0 6.953 1.933c7.383 0 13.373-5.99 13.373-13.373S23.423 2.667 16.04 2.667zm0 24.213a10.79 10.79 0 0 1-5.5-1.507l-.395-.235-4.08 1.23 1.246-3.97-.257-.408a10.81 10.81 0 0 1-1.67-5.75c0-5.98 4.867-10.847 10.856-10.847 5.98 0 10.847 4.867 10.847 10.847 0 5.99-4.867 10.856-10.847 10.856zm5.94-8.127c-.325-.163-1.925-.951-2.223-1.06-.298-.108-.515-.163-.732.163-.217.325-.84 1.06-1.03 1.278-.19.217-.38.244-.705.081-.325-.163-1.373-.506-2.615-1.612-.967-.862-1.62-1.926-1.81-2.251-.19-.325-.02-.5.143-.663.146-.146.325-.38.488-.57.163-.19.217-.325.325-.542.108-.217.054-.407-.027-.57-.081-.163-.732-1.766-1.004-2.42-.264-.635-.532-.55-.732-.56-.19-.008-.407-.01-.624-.01s-.57.081-.868.407c-.298.325-1.138 1.112-1.138 2.712 0 1.6 1.165 3.146 1.328 3.363.163.217 2.293 3.501 5.556 4.91.776.335 1.382.535 1.854.685.779.248 1.488.213 2.048.129.625-.093 1.925-.787 2.196-1.547.271-.76.271-1.412.19-1.548-.081-.135-.298-.217-.623-.38z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
