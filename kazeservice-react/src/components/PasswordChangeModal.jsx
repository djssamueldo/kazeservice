import { useState } from 'react';

const PasswordChangeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('Modification en cours...');
    setMsgType('info');
    setIsLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setMsg('Les nouveaux mots de passe ne correspondent pas.');
      setMsgType('error');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMsg('Le mot de passe doit contenir au moins 6 caractères.');
      setMsgType('error');
      setIsLoading(false);
      return;
    }

    try {
      const { changePassword } = await import('../api/auth');
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMsg('Mot de passe modifié avec succès !');
      setMsgType('success');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsLoading(false);
      setTimeout(() => {
        onClose();
        setMsg('');
      }, 2000);
    } catch (error) {
      setMsg(error.message || 'Erreur lors de la modification du mot de passe.');
      setMsgType('error');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex' }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Changer le mot de passe</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              name="currentPassword"
              required
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="field">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              name="newPassword"
              required
              minLength="6"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="field">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength="6"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="btn btn-primary block" disabled={isLoading}>
            {isLoading ? 'Modification en cours...' : 'Modifier le mot de passe'}
          </button>
          {msg && <p className={`form-msg ${msgType}`}>{msg}</p>}
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
