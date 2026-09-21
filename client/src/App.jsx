import { useState } from 'react'
import DemoNotice from './components/DemoNotice.jsx'
import SpinScreen from './components/SpinScreen.jsx'
import AddQuestScreen from './components/AddQuestScreen.jsx'
import HistoryScreen from './components/HistoryScreen.jsx'

// Three screens, switched by plain state rather than a router. Nothing here
// needs a URL to be shareable or bookmarkable, so a router would only add a
// dependency without adding anything useful.

const TABS = [
  { id: 'spin', label: 'Spin', component: SpinScreen },
  { id: 'add', label: 'Add Quest', component: AddQuestScreen },
  { id: 'history', label: 'History', component: HistoryScreen },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('spin')
  const ActiveComponent = TABS.find((tab) => tab.id === activeTab).component

  return (
    <div className="page">
      <header>
        <h1>Bordemmaxing</h1>
        <p className="lede">Bored? Spin for a random side quest.</p>
      </header>

      <DemoNotice />

      <nav className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <ActiveComponent />
    </div>
  )
}
