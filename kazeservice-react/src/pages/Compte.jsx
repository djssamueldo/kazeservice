import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/style.css';
import { signIn, signUp, signOut, getSession, getMyProfile, changePassword } from '../api/auth';
import { getMyAppointments } from '../api/appointments';
import WhatsAppFloat from '../components/WhatsAppFloat';

const Compte = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
  const [signupFormData, setSignupFormData] = useState({ nom: '', email: '', password: '' });
  const [loginMsg, setLoginMsg] = useState('');
  const [loginMsgType, setLoginMsgType] = useState('');
  const [signupMsg, setSignupMsg] = useState('');
  const [signupMsgType, setSignupMsgType] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState('');
  const [forgotPasswordMsgType, setForgotPasswordMsgType] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState({ token: '', email: '', password: '', password_confirmation: '' });
  const [verificationMsg, setVerificationMsg] = useState('');
  const [verificationMsgType, setVerificationMsgType] = useState('');

  useEffect(() => {
    const restoreSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const profile = await getMyProfile(session.user.id);
        const loadedUser = {
          nom: profile?.nom || session.user.email.split('@')[0],
          email: session.user.email,
          role: profile?.role || 'client',
          permissions: profile?.permissions || {},
        };
        setUser(loadedUser);
        setIsLoggedIn(true);
        const rdvs = await getMyAppointments(loadedUser.email);
        setAppointments(rdvs);
      }
    };
    restoreSession();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoginMsg('');
    setLoginMsgType('');
    setSignupMsg('');
    setSignupMsgType('');
  };

  const handleLoginChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupFormData({
      ...signupFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg('Connexion en cours...');
    setLoginMsgType('info');

    try {
      const { user: authUser } = await signIn({
        email: loginFormData.email.trim().toLowerCase(),
        password: loginFormData.password,
      });
      const profile = await getMyProfile(authUser.id);
      const loadedUser = {
        nom: profile?.nom || authUser.email.split('@')[0],
        email: authUser.email,
        role: profile?.role || 'client',
        permissions: profile?.permissions || {},
      };
      setUser(loadedUser);
      setIsLoggedIn(true);
      setLoginMsg('Connexion réussie !');
      setLoginMsgType('success');
      const rdvs = await getMyAppointments(loadedUser.email);
      setAppointments(rdvs);
      setTimeout(() => setLoginMsg(''), 3000);

      // Émettre un événement pour mettre à jour le Header
      window.dispatchEvent(new CustomEvent('auth-change'));
    } catch (error) {
      let errorMessage = 'Erreur lors de la connexion.';

      if (error.response?.data?.errors) {
        // Erreurs de validation Laravel
        const errors = error.response.data.errors;
        if (errors.email) {
          errorMessage = errors.email[0];
        } else if (errors.password) {
          errorMessage = errors.password[0];
        } else {
          errorMessage = Object.values(errors).flat().join(' ');
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'API non configuré') {
        errorMessage = "La connexion n'est pas encore activée sur ce site.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setLoginMsg(errorMessage);
      setLoginMsgType('error');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Validations frontend
    if (!signupFormData.nom.trim()) {
      setSignupMsg('Le nom est requis');
      setSignupMsgType('error');
      return;
    }

    if (signupFormData.nom.length > 255) {
      setSignupMsg('Le nom est trop long (maximum 255 caractères)');
      setSignupMsgType('error');
      return;
    }

    if (!signupFormData.email.trim()) {
      setSignupMsg('L\'email est requis');
      setSignupMsgType('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupFormData.email)) {
      setSignupMsg('L\'email n\'est pas valide');
      setSignupMsgType('error');
      return;
    }

    if (!signupFormData.password) {
      setSignupMsg('Le mot de passe est requis');
      setSignupMsgType('error');
      return;
    }

    if (signupFormData.password.length < 8) {
      setSignupMsg('Le mot de passe doit contenir au moins 8 caractères');
      setSignupMsgType('error');
      return;
    }

    setSignupMsg('Création du compte en cours...');
    setSignupMsgType('info');

    try {
      await signUp({
        nom: signupFormData.nom.trim(),
        email: signupFormData.email.trim().toLowerCase(),
        password: signupFormData.password,
      });
      setSignupMsg('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setSignupMsgType('success');
      setSignupFormData({ nom: '', email: '', password: '' });
      setTimeout(() => {
        setActiveTab('login');
        setSignupMsg('');
        setSignupMsgType('');
      }, 3000);
    } catch (error) {
      let errorMessage = 'Erreur lors de la création du compte';

      if (error.response?.data?.errors) {
        // Erreurs de validation Laravel
        const errors = error.response.data.errors;
        if (errors.email) {
          errorMessage = errors.email[0];
        } else if (errors.password) {
          errorMessage = errors.password[0];
        } else if (errors.nom) {
          errorMessage = errors.nom[0];
        } else {
          errorMessage = Object.values(errors).flat().join(' ');
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'API non configuré') {
        errorMessage = "L'inscription n'est pas encore activée sur ce site.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSignupMsg(errorMessage);
      setSignupMsgType('error');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setUser(null);
    setAppointments([]);
    setLoginFormData({ email: '', password: '' });

    // Émettre un événement pour mettre à jour le Header
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  const handleSendVerificationEmail = async () => {
    setVerificationMsg('Envoi de l\'e-mail de vérification...');
    setVerificationMsgType('info');
    try {
      await sendVerificationEmail();
      setVerificationMsg('E-mail de vérification envoyé avec succès !');
      setVerificationMsgType('success');
    } catch (error) {
      setVerificationMsg(error.message || 'Erreur lors de l\'envoi de l\'e-mail.');
      setVerificationMsgType('error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Validations frontend
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordMsg('L\'email est requis.');
      setForgotPasswordMsgType('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setForgotPasswordMsg('L\'email n\'est pas valide.');
      setForgotPasswordMsgType('error');
      return;
    }

    setForgotPasswordMsg('Envoi de l\'email de réinitialisation...');
    setForgotPasswordMsgType('info');

    try {
      await forgotPassword(forgotPasswordEmail.trim().toLowerCase());
      setForgotPasswordMsg('Email de réinitialisation envoyé avec succès !');
      setForgotPasswordMsgType('success');
      setForgotPasswordEmail('');
    } catch (error) {
      let errorMessage = 'Erreur lors de l\'envoi de l\'email';

      if (error.response?.data?.errors) {
        // Erreurs de validation Laravel
        const errors = error.response.data.errors;
        if (errors.email) {
          errorMessage = errors.email[0];
        } else {
          errorMessage = Object.values(errors).flat().join(' ');
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'API non configuré') {
        errorMessage = "La réinitialisation de mot de passe n'est pas encore activée sur ce site.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setForgotPasswordMsg(errorMessage);
      setForgotPasswordMsgType('error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validations frontend
    if (!resetPasswordData.email.trim()) {
      setLoginMsg('L\'email est requis.');
      setLoginMsgType('error');
      return;
    }

    if (!resetPasswordData.token.trim()) {
      setLoginMsg('Le token de réinitialisation est requis.');
      setLoginMsgType('error');
      return;
    }

    if (!resetPasswordData.password) {
      setLoginMsg('Le mot de passe est requis.');
      setLoginMsgType('error');
      return;
    }

    if (resetPasswordData.password.length < 8) {
      setLoginMsg('Le mot de passe doit contenir au moins 8 caractères.');
      setLoginMsgType('error');
      return;
    }

    if (resetPasswordData.password !== resetPasswordData.password_confirmation) {
      setLoginMsg('La confirmation du mot de passe ne correspond pas.');
      setLoginMsgType('error');
      return;
    }

    setLoginMsg('Réinitialisation du mot de passe...');
    setLoginMsgType('info');

    try {
      await resetPassword({
        token: resetPasswordData.token.trim(),
        email: resetPasswordData.email.trim().toLowerCase(),
        password: resetPasswordData.password,
        password_confirmation: resetPasswordData.password_confirmation,
      });
      setLoginMsg('Mot de passe réinitialisé avec succès !');
      setLoginMsgType('success');
      setActiveTab('login');
      setResetPasswordData({ token: '', email: '', password: '', password_confirmation: '' });
    } catch (error) {
      let errorMessage = 'Erreur lors de la réinitialisation.';

      if (error.response?.data?.errors) {
        // Erreurs de validation Laravel
        const errors = error.response.data.errors;
        if (errors.email) {
          errorMessage = errors.email[0];
        } else if (errors.password) {
          errorMessage = errors.password[0];
        } else if (errors.token) {
          errorMessage = errors.token[0];
        } else {
          errorMessage = Object.values(errors).flat().join(' ');
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'API non configuré') {
        errorMessage = "La réinitialisation de mot de passe n'est pas encore activée sur ce site.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setLoginMsg(errorMessage);
      setLoginMsgType('error');
    }
  };

  return (
    <div>
      <Header />

      <style>
        {`
          .tabs{ display:flex; gap:8px; margin-bottom: 28px; }
          .tab-btn{
            flex:1; padding: 12px; border-radius: 10px; border: 1px solid var(--ligne);
            background: var(--ivoire-carte); font-weight:600; cursor:pointer; font-family:'Work Sans',sans-serif;
          }
          .tab-btn.active{ background: var(--brique); color:#fff; border-color: var(--brique); }
          .panel{ display:none; }
          .panel.active{ display:block; }
          .account-view{ display:none; }
          .account-view.active{ display:block; }
          .role-row{ display:flex; align-items:center; gap:10px; margin-bottom:20px; }
          .badge-role{
            background: var(--brique); color: #fff; padding: 6px 12px; border-radius: 20px;
            font-size: 0.85rem; font-weight: 600;
          }
          .form-msg{ margin-top:12px; font-size:0.9rem; padding:10px 14px; border-radius:8px; }
          .form-msg.info{ background:var(--or-teinte); color:#8A5A0F; }
          .form-msg.success{ background:#D1FAE5; color:#065F46; }
          .form-msg.error{ background:#FEE2E2; color:#991B1B; }
          .welcome-header{ margin-bottom:24px; }
          .welcome-header h1{ font-size:2rem; margin-bottom:8px; }
          .welcome-header h1 span{ color:var(--brique); }
          .user-email{ color:var(--encre-douce); font-size:0.95rem; margin:0; }
        `}
      </style>

      <section className="section" style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div className="container">


          {!isLoggedIn ? (
            <div>
              <p className="eyebrow">Bienvenue</p>
              <h1>Connexion à votre compte</h1>

              <div className="tabs">
                <button
                  className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => handleTabChange('login')}
                >
Connexion
                </button>
                <button
                  className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => handleTabChange('signup')}
                >
Créer un compte
                </button>
              </div>

              <div className="form-card">
                <div className={`panel ${activeTab === 'login' ? 'active' : ''}`}>
                  {!showForgotPassword ? (
                    <form onSubmit={handleLogin}>
                      <div className="field">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={loginFormData.email}
                          onChange={handleLoginChange}
                        />
                      </div>
                      <div className="field">
                        <label>Mot de passe</label>
                        <input
                          type="password"
                          name="password"
                          required
                          value={loginFormData.password}
                          onChange={handleLoginChange}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary block">Se connecter</button>
                      {loginMsg && <p className={`form-msg ${loginMsgType}`}>{loginMsg}</p>}
                      {loginMsgType === 'error' && (
                        <button
                          type="button"
                          onClick={() => {
                            setForgotPasswordEmail(loginFormData.email);
                            setShowForgotPassword(true);
                            setLoginMsg('');
                          }}
                          style={{
                            marginTop: '12px',
                            padding: '8px 16px',
                            background: 'transparent',
                            color: '#12699F',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            textDecoration: 'underline'
                          }}
                        >
                          Mot de passe oublié ?
                        </button>
                      )}
                    </form>
                  ) : (
                    <form onSubmit={handleForgotPassword}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#12699F' }}>Réinitialiser le mot de passe</h3>
                      <div className="field">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary block">Envoyer</button>
                      {forgotPasswordMsg && <p className={`form-msg ${forgotPasswordMsgType}`}>{forgotPasswordMsg}</p>}
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotPasswordMsg('');
                          setLoginMsg('');
                        }}
                        style={{
                          marginTop: '12px',
                          padding: '8px 16px',
                          background: 'transparent',
                          color: '#666',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        ← Retour à la connexion
                      </button>
                    </form>
                  )}
                </div>

                <div className={`panel ${activeTab === 'signup' ? 'active' : ''}`}>
                  <form onSubmit={handleSignupSubmit}>
                    <div className="field">
                      <label>Nom complet</label>
                      <input
                        type="text"
                        name="nom"
                        required
                        value={signupFormData.nom}
                        onChange={handleSignupChange}
                      />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={signupFormData.email}
                        onChange={handleSignupChange}
                      />
                    </div>
                    <div className="field">
                      <label>Mot de passe</label>
                      <input
                        type="password"
                        name="password"
                        required
                        minLength="6"
                        value={signupFormData.password}
                        onChange={handleSignupChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary block">Créer mon compte</button>
                    {signupMsg && <p className={`form-msg ${signupMsgType}`}>{signupMsg}</p>}
                  </form>
                </div>

                {showForgotPassword && (
                  <div className={`panel ${activeTab === 'forgot' ? 'active' : ''}`}>
                    <form onSubmit={handleForgotPassword}>
                      <div className="field">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary block">Envoyer</button>
                      {loginMsg && <p className={`form-msg ${loginMsgType}`}>{loginMsg}</p>}
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setActiveTab('login');
                          setLoginMsg('');
                        }}
                        style={{
                          marginTop: '12px',
                          padding: '8px 16px',
                          background: 'transparent',
                          color: '#666',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        ← Retour à la connexion
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="account-view active">
              <div className="welcome-header">
                <h1>Bienvenue, <span>{user?.nom}</span></h1>
                <p className="user-email">{user?.email}</p>
              </div>
              {user?.email_verified_at === null && (
                <div style={{ marginBottom: '20px', padding: '12px', background: '#FEF3C7', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#92400E' }}>
                    Votre email n'est pas encore vérifié
                  </p>
                  <button
                    onClick={handleSendVerificationEmail}
                    style={{ padding: '6px 12px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Renvoyer l'email de vérification
                  </button>
                  {verificationMsg && <p style={{ marginTop: '8px', fontSize: '0.85rem', color: verificationMsgType === 'success' ? '#065F46' : '#991B1B' }}>{verificationMsg}</p>}
                </div>
              )}
              <div className="role-row">
                <span className="badge-role">
                  {(() => {
                    if (user?.role === 'admin') return 'Administrateur';
                    if (Object.values(user?.permissions || {}).some(Boolean)) return 'Administrateur';
                    if (user?.role === 'partenaire') return 'Partenaire';
                    return 'Client';
                  })()}
                </span>
              </div>
              <div className="form-card">
                <h3>Mes rendez-vous</h3>
                <div style={{ marginTop: '16px' }}>
                  {appointments.length > 0 ? (
                    appointments.map((rdv, index) => (
                      <div key={index} style={{ padding: '10px 0', borderBottom: '1px solid var(--ligne)', fontSize: '.9rem' }}>
                        <strong>{rdv.motif}</strong> — {rdv.date_souhaitee} ({rdv.creneau}) — <span style={{ color: 'var(--encre-douce)' }}>{rdv.statut}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--encre-douce)', fontSize: '.9rem' }}>Aucun rendez-vous</p>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                {(user?.role === 'admin' || Object.values(user?.permissions || {}).some(Boolean)) && (
                  <Link to="/admin" className="btn btn-outline block">Panneau d'administration</Link>
                )}
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />

      <WhatsAppFloat />
    </div>
  );
};

export default Compte;