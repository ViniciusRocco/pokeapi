import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useStore } from '../../store'

type Step =
  | 'splash' | 'onboarding-one' | 'onboarding-two' | 'choice'
  | 'register-provider' | 'register-email' | 'register-password' | 'register-name' | 'register-loading' | 'register-success'
  | 'login-provider' | 'login-form' | 'login-loading' | 'login-success'
  | 'forgot-email' | 'forgot-code'
  | 'google-access'

interface WelcomeFlowProps {
  firstRun?: boolean
  initialStep?: 'choice' | 'login-provider' | 'register-provider'
  onComplete: () => void
}

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`

export function WelcomeFlow({ firstRun = false, initialStep = 'choice', onComplete }: WelcomeFlowProps) {
  const { register, login, hasAccount, continueWithGoogle } = useStore()
  const [step, setStep] = useState<Step>(firstRun ? 'splash' : initialStep)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [googleTarget, setGoogleTarget] = useState<'register' | 'login'>('login')

  useEffect(() => {
    if (step !== 'splash') return
    const timer = window.setTimeout(() => setStep('onboarding-one'), 1400)
    return () => window.clearTimeout(timer)
  }, [step])

  async function submitLogin(event: FormEvent) {
    event.preventDefault()
    setError('')
    setStep('login-loading')
    const success = await login(email, password)
    window.setTimeout(() => {
      if (success) setStep('login-success')
      else {
        setError('E-mail ou senha inválidos.')
        setStep('login-form')
      }
    }, 650)
  }

  async function finishRegistration() {
    setStep('register-loading')
    await register(name, email, password)
    window.setTimeout(() => setStep('register-success'), 650)
  }

  if (step === 'splash' || step === 'register-loading' || step === 'login-loading') {
    return (
      <div className="splash-screen" role="status" aria-label="Carregando">
        <img src={asset('Pok%C3%A9dex-desktop.png')} alt="Pokédex" />
        {step !== 'splash' && <span className="auth-spinner" />}
      </div>
    )
  }

  const back = (target: Step) => (
    <button className="auth-back" onClick={() => { setError(''); setStep(target) }} aria-label="Voltar"><ArrowLeft /></button>
  )

  if (step === 'onboarding-one') {
    return (
      <div className="welcome-shell"><section className="welcome-card">
        <button className="skip" onClick={onComplete}>Pular →</button>
        <img className="welcome-art" src={asset('Group28.png')} alt="Professor e treinador Pokémon" />
        <h1>Todos os Pokémons em um só lugar</h1>
        <p>Acesse uma vasta lista de Pokémon de todas as gerações.</p>
        <div className="steps"><b /><span /></div>
        <button className="primary-action" onClick={() => setStep('onboarding-two')}>Continuar</button>
      </section></div>
    )
  }

  if (step === 'onboarding-two') {
    return (
      <div className="welcome-shell"><section className="welcome-card">
        <button className="skip" onClick={onComplete}>Pular →</button>
        <img className="welcome-art" src={asset('Frame1000002626.png')} alt="Treinadora Pokémon" />
        <h1>Mantenha sua Pokédex atualizada</h1>
        <p>Cadastre-se e mantenha seu perfil, favoritos e comparações sempre com você.</p>
        <div className="steps"><span /><b /></div>
        <button className="primary-action" onClick={() => setStep('choice')}>Vamos começar!</button>
      </section></div>
    )
  }

  if (step === 'choice') {
    return (
      <div className="welcome-shell"><section className="welcome-card">
        {!firstRun && back('choice')}
        <button className="skip" onClick={onComplete}>Pular →</button>
        <img className="welcome-art duo" src={asset('Group29.png')} alt="Treinadores Pokémon" />
        <h1>Está pronto para essa aventura?</h1>
        <p>Basta criar uma conta e começar a explorar o mundo dos Pokémon hoje!</p>
        <button className="primary-action" onClick={() => setStep('register-provider')}>Criar conta</button>
        <button className="text-action" onClick={() => setStep('login-provider')}>Já tenho uma conta</button>
      </section></div>
    )
  }

  if (step === 'register-provider' || step === 'login-provider') {
    const registering = step === 'register-provider'
    return (
      <div className="welcome-shell"><section className="welcome-card auth-provider">
        {back('choice')}<strong className="auth-title">{registering ? 'Criar conta' : 'Entrar'}</strong>
        <img className="provider-art" src={asset(registering ? 'Group39.png' : 'image146.png')} alt="Treinador Pokémon" />
        <h1>{registering ? 'Falta pouco para explorar esse mundo!' : 'Que bom ter você aqui novamente!'}</h1>
        <p>Como deseja se conectar?</p>
        <button className="social-action" type="button" disabled title="Requer configuração do Apple OAuth">● &nbsp; Continuar com a Apple</button>
        <button className="social-action" type="button" onClick={() => { setGoogleTarget(registering ? 'register' : 'login'); setStep('google-access') }}><b className="google">G</b> &nbsp; Continuar com o Google</button>
        <button className="primary-action" onClick={() => setStep(registering ? 'register-email' : 'login-form')}>Continuar com um e-mail</button>
      </section></div>
    )
  }

  if (step === 'register-email') {
    const valid = /^\S+@\S+\.\S+$/.test(email)
    return <FormScreen title="Criar conta" back={() => setStep('register-provider')} eyebrow="Vamos começar!" heading="Qual é o seu e-mail?">
      <label>E-mail<input autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" /></label>
      <small>Use um endereço de e-mail válido.</small>
      <button className="primary-action" disabled={!valid} onClick={() => setStep('register-password')}>Continuar</button>
    </FormScreen>
  }

  if (step === 'google-access') {
    const valid = /^\S+@\S+\.\S+$/.test(email) && name.trim().length >= 2
    return <FormScreen title="Acesso com Google" back={() => setStep(googleTarget === 'register' ? 'register-provider' : 'login-provider')} eyebrow="Demonstração local" heading="Informe sua conta Google">
      <label>Nome<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" /></label>
      <label>E-mail do Google<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@gmail.com" /></label>
      <small>Este modo demonstra o fluxo sem contatar o Google. OAuth real exige um Client ID do Google Cloud.</small>
      <button className="primary-action" disabled={!valid} onClick={async () => { setStep('login-loading'); await continueWithGoogle(name, email); window.setTimeout(() => setStep(googleTarget === 'register' ? 'register-success' : 'login-success'), 650) }}>Continuar</button>
    </FormScreen>
  }

  if (step === 'register-password') {
    return <FormScreen title="Criar conta" back={() => setStep('register-email')} eyebrow="Agora..." heading="Crie uma senha">
      <label>Senha<div className="password-input"><input autoFocus type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha" /><button onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
      <small>Sua senha deve ter pelo menos 8 caracteres.</small>
      <button className="primary-action" disabled={password.length < 8} onClick={() => setStep('register-name')}>Continuar</button>
    </FormScreen>
  }

  if (step === 'register-name') {
    return <FormScreen title="Criar conta" back={() => setStep('register-password')} eyebrow="Pra finalizar" heading="Qual é o seu nome?">
      <label>Nome<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome" /></label>
      <small>Esse será seu nome de usuário no aplicativo.</small>
      <button className="primary-action" disabled={name.trim().length < 2} onClick={finishRegistration}>Criar conta</button>
    </FormScreen>
  }

  if (step === 'register-success' || step === 'login-success') {
    const registered = step === 'register-success'
    return <div className="welcome-shell"><section className="welcome-card success-card">
      <CheckCircle2 className="success-mark" />
      <img className="success-art" src={asset(registered ? 'Group40.png' : 'Group41.png')} alt="Treinadores Pokémon" />
      <h1>{registered ? 'Sua conta foi criada com sucesso!' : `Bem-vindo de volta, ${name || 'treinador'}!`}</h1>
      <p>{registered ? 'Seja bem-vindo, treinador! Estamos animados para acompanhar sua jornada.' : 'Esperamos que tenha uma longa jornada desde a última vez em que nos vimos.'}</p>
      <button className="primary-action" onClick={onComplete}>Continuar</button>
    </section></div>
  }

  if (step === 'login-form') {
    const valid = /^\S+@\S+\.\S+$/.test(email) && password.length >= 8
    return <FormScreen title="Entrar" back={() => setStep('login-provider')} eyebrow="Bem-vindo de volta!" heading="Preencha os dados">
      <form onSubmit={submitLogin} className="auth-form-inner">
        <label>E-mail<input autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" /></label>
        <label>Senha<div className="password-input"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha" /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
        {error && <p className="auth-error">{error}</p>}
        <button type="button" className="forgot-link" onClick={() => setStep('forgot-email')}>Esqueceu sua senha?</button>
        <button className="primary-action" disabled={!valid}>Entrar</button>
      </form>
    </FormScreen>
  }

  if (step === 'forgot-email') {
    const valid = /^\S+@\S+\.\S+$/.test(email)
    return <FormScreen title="Esqueci minha senha" back={() => setStep('login-form')} eyebrow="Vamos recuperar!" heading="Qual é o seu e-mail?">
      <label>E-mail<input autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" /></label>
      {error && <p className="auth-error">{error}</p>}
      <button className="primary-action" disabled={!valid} onClick={() => { if (hasAccount(email)) { setError(''); setStep('forgot-code') } else setError('Não encontramos uma conta com este e-mail.') }}>Continuar</button>
    </FormScreen>
  }

  return <FormScreen title="Esqueci minha senha" back={() => setStep('forgot-email')} eyebrow="Insira o código" heading="Digite o código de 6 dígitos enviado para o seu e-mail">
    <input className="code-input" autoFocus inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} placeholder="••••••" />
    <small>Para esta demonstração, use o código 456238.</small>
    {error && <p className="auth-error">{error}</p>}
    <button className="primary-action" disabled={code.length !== 6} onClick={() => { if (code === '456238') { setError('Código validado. Agora você pode entrar novamente.'); setStep('login-form') } else setError('Código inválido. Use 456238.') }}>Continuar</button>
  </FormScreen>
}

function FormScreen({ title, eyebrow, heading, back, children }: { title: string; eyebrow: string; heading: string; back: () => void; children: React.ReactNode }) {
  return <div className="welcome-shell"><section className="welcome-card form-card">
    <button className="auth-back" onClick={back} aria-label="Voltar"><ArrowLeft /></button>
    <strong className="auth-title">{title}</strong>
    <div className="form-copy"><span>{eyebrow}</span><h1>{heading}</h1></div>
    <div className="form-fields">{children}</div>
  </section></div>
}
