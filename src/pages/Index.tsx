import { useState } from 'react';
import { AppSidebar } from '../components/AppSidebar';
import { ChatView } from '../components/ChatView';
import { AgentsView } from '../components/AgentsView';
import { WorkflowsView } from '../components/WorkflowsView';
import { PromptsView } from '../components/PromptsView';
import { SkillsView } from '../components/SkillsView';
import { IntegrationsView } from '../components/IntegrationsView';
import { NotesView } from '../components/NotesView';
import type { NavItem, Chat, Message } from '../types';

const INITIAL_CHAT: Chat = { id: 'main', title: 'Chat', messages: [] };

export function IndexPage() {
  const [activeView, setActiveView] = useState<NavItem>('chat');
  const [chat, setChat] = useState<Chat>(INITIAL_CHAT);
  const [pendingInput, setPendingInput] = useState('');

  const handleUpdateChat = (messages: Message[]) => {
    setChat((c) => ({ ...c, messages }));
  };

  const handleUsePrompt = (content: string) => {
    setPendingInput(content);
    setActiveView('chat');
  };

  const renderView = () => {
    if (activeView === 'chat') {
      return (
        <ChatView
          chat={chat}
          onUpdateChat={handleUpdateChat}
          pendingInput={pendingInput}
          onPendingInputConsumed={() => setPendingInput('')}
        />
      );
    }
    if (activeView === 'agents') return <AgentsView />;
    if (activeView === 'workflows') return <WorkflowsView />;
    if (activeView === 'prompts')
      return <PromptsView onUsePrompt={handleUsePrompt} onViewChange={setActiveView} />;
    if (activeView === 'skills') return <SkillsView />;
    if (activeView === 'integrations') return <IntegrationsView />;
    if (activeView === 'notes') return <NotesView />;
    return null;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA]">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-hidden flex flex-col">{renderView()}</main>
    </div>
  );
}
