import React, { useState, useEffect } from 'react';
import { User, Music, Download, Clock, Trash2, Play, Pause, Volume2, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseTokens } from '@/contexts/SupabaseTokenContext';
import { Header } from '@/components/ui/Header';

interface ProfilePageProps {
  onBack: () => void;
  onTokenChargeClick: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onTokenChargeClick }) => {
  const { user: authUser, signOut } = useAuth();
  const { tokens: supabaseTokens, getTransactionHistory } = useSupabaseTokens();
  const [activeTab, setActiveTab] = useState<'profile' | 'tokens' | 'music'>('profile');
  const [transactions, setTransactions] = useState<any[]>([]);

  // Load transaction history
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const history = await getTransactionHistory();
        setTransactions(history);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    };

    if (authUser) {
      loadTransactions();
    }
  }, [authUser, getTransactionHistory]);

  // Mock data for music history (실제로는 데이터베이스에서 가져와야 함)
  const musicHistory = [
    {
      id: '1',
      title: '비 오는 날의 감성',
      prompt: '비 오는 날 카페에서 느끼는 차분하고 로맨틱한 분위기',
      createdAt: new Date('2024-01-15'),
      duration: 120,
      genre: 'Ambient',
      downloadUrl: '#'
    },
    {
      id: '2', 
      title: '힐링 피아노',
      prompt: '스트레스 해소를 위한 잔잔하고 평화로운 피아노 음악',
      createdAt: new Date('2024-01-10'),
      duration: 180,
      genre: 'Piano',
      downloadUrl: '#'
    }
  ];

  const handleLogoClick = () => {
    onBack();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-900/30 to-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.20),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(161,98,7,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,248,220,0.08),transparent_70%)]"></div>
      </div>

      {/* Header */}
      <Header 
        onTokenChargeClick={onTokenChargeClick}
        onLogoClick={handleLogoClick}
        showTokens={false}
      />

      <div className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="group flex items-center space-x-2 bg-stone-900/60 hover:bg-stone-800/70 backdrop-blur-xl rounded-2xl px-4 py-2 border border-amber-200/30 hover:border-amber-200/50 text-amber-100 hover:text-amber-50 transition-all duration-300 shadow-lg"
            >
              <ArrowLeft size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="font-medium">홈으로 돌아가기</span>
            </button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600/25 to-orange-600/25 backdrop-blur-xl rounded-full px-6 py-2 border border-amber-200/30 mb-6">
              <Settings className="w-5 h-5 text-amber-300" />
              <span className="text-amber-100 font-medium">내 정보 관리</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-50 via-orange-100 to-amber-100 bg-clip-text text-transparent mb-6 leading-tight drop-shadow-sm">
              프로필 & 음악 관리
            </h1>
            <p className="text-xl text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
              계정 정보, 토큰 내역, 그리고 <span className="text-amber-300 font-semibold">생성한 음악들</span>을 관리하세요
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-stone-900/60 backdrop-blur-xl rounded-2xl border border-amber-200/25 p-2 shadow-2xl">
              {[
                { id: 'profile', label: '계정 정보', icon: User },
                { id: 'tokens', label: '토큰 내역', icon: Music },
                { id: 'music', label: '내 음악', icon: Volume2 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                      : 'text-amber-100/80 hover:text-amber-50 hover:bg-stone-800/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-amber-200/25 p-8 shadow-2xl">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-amber-50 mb-6">계정 정보</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-amber-100/80 font-medium mb-2">이름</label>
                      <div className="bg-stone-900/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200/20">
                        <span className="text-amber-50">{authUser?.full_name || '이름 없음'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-amber-100/80 font-medium mb-2">이메일</label>
                      <div className="bg-stone-900/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200/20">
                        <span className="text-amber-50">{authUser?.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-amber-100/80 font-medium mb-2">현재 토큰</label>
                      <div className="bg-gradient-to-r from-amber-600/25 to-orange-600/25 backdrop-blur-sm rounded-xl p-4 border border-amber-400/35">
                        <div className="flex items-center space-x-2">
                          <Music className="w-5 h-5 text-amber-300" />
                          <span className="text-2xl font-bold text-amber-200">{supabaseTokens}</span>
                          <span className="text-amber-100/80">토큰</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-amber-100/80 font-medium mb-2">가입일</label>
                      <div className="bg-stone-900/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200/20">
                        <span className="text-amber-50">
                          {authUser?.created_at ? new Date(authUser.created_at).toLocaleDateString('ko-KR') : '정보 없음'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tokens' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-amber-50">토큰 사용 내역</h2>
                  <button
                    onClick={onTokenChargeClick}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    토큰 충전하기
                  </button>
                </div>
                
                <div className="space-y-4">
                  {transactions && transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <div key={index} className="bg-stone-900/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'purchase' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              <Music className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-amber-50 font-medium">{transaction.description}</div>
                              <div className="text-amber-100/60 text-sm">
                                {new Date(transaction.created_at).toLocaleString('ko-KR')}
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold ${
                            transaction.type === 'purchase' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount} 토큰
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Music className="w-16 h-16 text-amber-200/40 mx-auto mb-4" />
                      <p className="text-amber-100/60">아직 토큰 내역이 없습니다</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'music' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-amber-50">생성한 음악</h2>
                
                <div className="space-y-4">
                  {musicHistory.length > 0 ? (
                    musicHistory.map((music) => (
                      <div key={music.id} className="bg-stone-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-200/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-amber-50 mb-2">{music.title}</h3>
                            <p className="text-amber-100/80 mb-3">{music.prompt}</p>
                            <div className="flex items-center space-x-4 text-sm text-amber-100/60">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{music.duration}초</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Music className="w-4 h-4" />
                                <span>{music.genre}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>{music.createdAt.toLocaleDateString('ko-KR')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-lg transition-colors">
                              <Play className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Volume2 className="w-16 h-16 text-amber-200/40 mx-auto mb-4" />
                      <p className="text-amber-100/60 mb-4">아직 생성한 음악이 없습니다</p>
                      <button
                        onClick={onBack}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                      >
                        음악 만들러 가기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};