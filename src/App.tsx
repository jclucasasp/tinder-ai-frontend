import { ConversationInterface, ProfileInterface } from './lib/interfaces';
import { GetProfileById, GetRandomProfile } from './api/profiles';
import { User, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import ChatMessages from './components/chat-component';
import Profiles from './components/profile-component';
import Matches from './components/matches-component';
import Login from './auth/login';
import './App.css';

function App() {

  type StateTypes = 'profile' | 'match' | 'chat' | 'login';

  const [currentScreen, setCurrentScreen] = useState<StateTypes>('profile');
  const [currentProfile, setCurrentProfile] = useState<ProfileInterface | null>({} as ProfileInterface);
  const [currentConversation, setCurrentConversation] = useState<ConversationInterface>({} as ConversationInterface);

  const currentProfileSelect = async (id?: string) => {
    let profileData = {} as Promise<ProfileInterface>;
    if (!id) {
      profileData = GetRandomProfile();
    } else {
      profileData = GetProfileById(id);
    }

    const [profile] = await Promise.all([profileData]);
    setCurrentProfile(profile);
  }

  if (!currentProfile) {
    currentProfileSelect();
  }

  useEffect(() => {
    currentProfileSelect();
  }, []);

  if (currentScreen === 'login') {
    return <Login />;
  }


  return (
    <div className='max-w-lg mx-auto mt-3'>
      <nav className='flex justify-between mb-6'>

        <User className='cursor-pointer w-8 h-8 hover:w-9 hover:h-9' onClick={() => setCurrentScreen('profile')} />
        <div className='w-9 h-9' />
        <MessageCircle className='cursor-pointer w-8 h-8 hover:w-9 hover:h-9' onClick={() => setCurrentScreen('match')} />
      </nav>
      {currentScreen === 'profile' && <Profiles profile={currentProfile} nextProfile={setCurrentProfile} />}
      {currentScreen === 'match' && <Matches screen={setCurrentScreen} viewProfile={setCurrentProfile} currentConversation={setCurrentConversation} />}
      {currentScreen === 'chat' && <ChatMessages chatmessages={currentConversation} selectedProfile={currentProfile} />}
    </div>
  );
}

export default App