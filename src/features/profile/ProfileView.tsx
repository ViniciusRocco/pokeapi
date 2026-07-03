import { ChevronRight, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../store'

export function ProfileView({ onAuthenticate }: { onAuthenticate: () => void }) {
  const { account, logout } = useStore()
  const [updates, setUpdates] = useState(true)
  const [worldNews, setWorldNews] = useState(true)

  return <section className="profile-view">
    <header className="profile-header">
      <div className="profile-avatar">{account?.name.charAt(0).toUpperCase() ?? '?'}</div>
      <div><span>Conta</span><h1>{account?.name ?? 'Treinador visitante'}</h1></div>
    </header>

    {!account && <div className="profile-guest">
      <img src={`${import.meta.env.BASE_URL}assets/Group29.png`} alt="Treinadores Pokémon" />
      <p>Mantenha sua Pokédex atualizada e participe desse mundo.</p>
      <button onClick={onAuthenticate}>Entre ou Cadastre-se</button>
    </div>}

    {account && <SettingsSection title="Informações da conta">
      <SettingRow label="Nome" value={account.name} />
      <SettingRow label="E-mail" value={account.email} />
      <SettingRow label="Senha" value="••••••••••" />
    </SettingsSection>}

    <SettingsSection title="Pokédex">
      <ToggleRow label="Mega evoluções" description="Habilita a exibição de mega evoluções." />
      <ToggleRow label="Outras formas" description="Habilita formas alternativas dos Pokémon." />
    </SettingsSection>

    <SettingsSection title="Notificações">
      <ToggleRow label="Atualizações na pokédex" description="Novos Pokémon, habilidades e informações." checked={updates} onChange={setUpdates} />
      <ToggleRow label="Mundo Pokémon" description="Acontecimentos e informações do mundo Pokémon." checked={worldNews} onChange={setWorldNews} />
    </SettingsSection>

    <SettingsSection title="Idioma">
      <SettingRow label="Idioma da interface" value="Português (PT-BR)" />
      <SettingRow label="Idioma de informações em jogo" value="English (US)" />
    </SettingsSection>

    <SettingsSection title="Geral">
      <SettingRow label="Versão" value="1.0.0" arrow={false} />
      <SettingRow label="Termos e condições" value="Tudo o que você precisa saber." />
      <SettingRow label="Central de ajuda" value="Precisa de ajuda? Fale conosco." />
      <SettingRow label="Sobre" value="Saiba mais sobre o app." />
    </SettingsSection>

    {account && <button className="logout-button" onClick={logout}><LogOut /> Sair</button>}
  </section>
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="settings-section"><h2>{title}</h2>{children}</section>
}

function SettingRow({ label, value, arrow = true }: { label: string; value: string; arrow?: boolean }) {
  return <div className="setting-row"><div><b>{label}</b><span>{value}</span></div>{arrow && <ChevronRight />}</div>
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked?: boolean; onChange?: (checked: boolean) => void }) {
  const [internal, setInternal] = useState(false)
  const value = checked ?? internal
  return <label className="setting-row toggle-row"><div><b>{label}</b><span>{description}</span></div><input type="checkbox" checked={value} onChange={(event) => { setInternal(event.target.checked); onChange?.(event.target.checked) }} /><i /></label>
}
